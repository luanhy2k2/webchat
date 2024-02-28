// Import các module cần thiết của Angular
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as signalR from '@microsoft/signalr'; // Import signalR module
import { ChatMessage } from 'src/Model/ChatMessage.model';
import { ChatRoom } from 'src/Model/ChatRoom.model';
import { ChatUser } from 'src/Model/ChatUser.model';
import { ChatHubService } from 'src/Services/chatHub.service';
import { RoomService } from 'src/Services/room.service';
import { UploadService } from 'src/Services/upload.service';
import { UserService } from 'src/Services/user.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  connection!: signalR.HubConnection;
  roomCreate = {
    id: 0,
    name: ""
  }
  message: string = "";
  chatRooms: ChatRoom[] = [];
  chatUsers: ChatUser[] = [];
  chatMessages: ChatMessage[] = [];
  joinedRoom: string = "";
  joinedRoomId: string = "";
  serverInfoMessage: string = "";
  reNameRoom:string = "";
  myName: string = "";
  myAvatar: string = "avatar1.png";
  isLoading: boolean = true;
  selectedFile!: File; 
  onFileChanged(event: any) {
    this.selectedFile = event.target.files[0];
    this.uploadService.uploadFile(this.selectedFile,this.joinedRoomId).subscribe(res =>{
    
    })
  }
  constructor(private chatService: ChatHubService, private uploadService:UploadService,
     private roomService: RoomService) { }

  ngOnInit(): void {
    this.chatService.startConnection();
    this.roomList();
    this.userList();
    this.chatService.addNewMessageListener((messageView: any) => {
      let isMine = messageView.user === this.myName;
      let message = new ChatMessage(messageView.content, messageView.timestamp,
        messageView.user, isMine, messageView.avartar);
      this.chatMessages.push(message);
    });
    this.chatService.addProfileInfoListener((displayName: any, avatar: any) => {
      this.myName = displayName;
      this.myAvatar = avatar;
      console.log(this.myAvatar)
      this.isLoading = false;
    });
    this.chatService.addRemoveUserListener((user: any) => {
      this.userRemoved(user.username);
    })
    this.chatService.addAddUserListener((user: any) => {
      this.userAdded(
        new ChatUser(user.username, user.fullName, user.avatar, user.currentRoom,
          user.device));
    });
    this.chatService.addDeleteRoomListener((roomId:any) =>{
      this.roomDeleted(roomId);
    })
    this.chatService.addChatRoomListener((room: any) => {
      this.roomAdded(
        new ChatRoom(room.id, room.name));
    });
    this.chatService.addEditRoomListener((room: any) => {
      this.roomUpdated(
        new ChatRoom(room.id, room.name));
    });
  }
 
  
  sendNewMessage() {
    if (this.message.startsWith("/")) {
      const receiver = this.message.substring(this.message.indexOf("(") + 1, this.message.indexOf(")"));
      const messageContent = this.message.substring(this.message.indexOf(")") + 1, this.message.length);
      this.sendPrivate(receiver.trim(), messageContent.trim());
    }
    else {
      this.sendToRoom(this.joinedRoom, this.message);
    }
    this.message = "";
  }

  sendToRoom(roomName: string, message: string) {
    this.roomService.createMessage(roomName, message).subscribe(res => {
    })
  }

  sendPrivate(receiver: string, message: string): void {
    this.chatService.sendPrivate(receiver, message)
      .then(() => {
        // Handle success if needed
      })
      .catch(error => console.error("Error sending private message: ", error));
  }

  joinRoom(room: ChatRoom) {
    this.chatService.joinRoom(room.name)
      .then(() => {
        this.joinedRoom = room.name;
        this.joinedRoomId = room.id;
        this.userList();
        this.messageHistory();
      })
      .catch(error => console.error("Error joining room: ", error));
  }

  openEditRoom(){
   this.reNameRoom = this.joinedRoom;
  }
  roomList() {
    this.roomService.GetRoom()
      .subscribe(data => {
        this.chatRooms = data.map(room => new ChatRoom(room.id, room.name));

        console.log(this.chatRooms)
        if (this.chatRooms.length > 0)
          this.joinRoom(this.chatRooms[1]);
      });
  }
  userList(): void {
    this.chatService.getUserList(this.joinedRoom)
      .then((result: any) => {
        this.chatUsers = result.map((user: any) => new ChatUser(
          user.username,
          user.fullName,
          user.avartar == null ? "default-avatar.png" : user.avartar,
          user.currentRoom,
          user.device
        ));
        console.log(result)
      })
      .catch(error => console.error("Error loading user list: ", error));
  }

  createRoom() {
    this.roomService.createRoom(this.roomCreate)
      .subscribe(res => {
        alert("Tạo room thành công");
        console.log(res);
      })
  }
  editRoom() {
    this.roomService.EditRoom(this.joinedRoomId, this.reNameRoom).subscribe(res =>{
      alert("Update room success!");
    })
  }
  deleteRoom() {
    this.roomService.DeleteRoom(this.joinedRoomId).subscribe(res =>{
      alert("Delete room success!")
    })
  }
  messageHistory() {
    this.roomService.GetMessageRoom(this.joinedRoom)
      .subscribe(data => {
        console.log(data)
        this.chatMessages = data.map((message: any) => {
          const isMine = message.user === this.myName;
          return new ChatMessage(
            message.content,
            message.timestamp,
            message.user,
            isMine,
            message.avartar
          );
          
         
        });

        const chatBody = document.querySelector('.chat-body');
        if (chatBody) {
          chatBody.scrollTop = chatBody.scrollHeight;
        }
      });
  }
  roomAdded(room: ChatRoom) {
    this.chatRooms.push(room);
  }
  roomUpdated(updatedRoom: ChatRoom) {
    const roomIndex = this.chatRooms.findIndex(room => room.id == updatedRoom.id);
    if (roomIndex !== -1) {
      this.chatRooms[roomIndex].name = updatedRoom.name;
      if (this.joinedRoomId === updatedRoom.id) {
        this.joinRoom(updatedRoom);
      }
    }
  }

  roomDeleted(id: string) {
    const roomIndex = this.chatRooms.findIndex(room => room.id === id);
    if (roomIndex !== -1) {
      this.chatRooms.splice(roomIndex, 1);
      if (this.chatRooms.length === 0) {
        this.joinedRoom = "";
      } else {
        this.joinRoom(this.chatRooms[0]);
      }
    }
  }

  userAdded(user: ChatUser) {
    this.chatUsers.push(user);
  }

  userRemoved(id: string) {
    const userIndex = this.chatUsers.findIndex(user => user.userName === id);
    if (userIndex !== -1) {
      this.chatUsers.splice(userIndex, 1);
    }
  }

  uploadFiles() {
    const form = document.getElementById("uploadForm") as HTMLFormElement;
    fetch('/api/Upload', {
      method: "POST",
      body: new FormData(form)
    }).then(() => {
      (<HTMLInputElement>document.getElementById("UploadedFile")).value = "";
    }).catch(error => {
      alert('Error: ' + error);
    });
  }
  showModal: boolean = false;

  openModal() {
    // Đặt showModal thành true để hiển thị modal
    this.showModal = true;
  }

  closeModal() {
    // Đặt showModal thành false để ẩn modal
    this.showModal = false;
  }
}
