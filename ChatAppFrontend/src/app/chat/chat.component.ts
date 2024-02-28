// Import các module cần thiết của Angular
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as signalR from '@microsoft/signalr'; // Import signalR module
import { RoomService } from 'src/Service/room.service';
import { UserService } from 'src/Service/user.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  connection!: signalR.HubConnection; 
  roomCreate = {
    id: 0,
    name:""
  }

  message: string = ""; 
  chatRooms: ChatRoom[] = []; 
  chatUsers: ChatUser[] = []; 
  chatMessages: ChatMessage[] = []; 
  joinedRoom: string = ""; 
  joinedRoomId: string = ""; 
  serverInfoMessage: string = ""; 
  myName: string = ""; 
  myAvatar: string = "avatar1.png"; 
  isLoading: boolean = true; 

  constructor(private http: HttpClient, private userService:UserService, private roomService:RoomService) { }

  ngOnInit(): void {
    this.connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7066/chatHub",{
      accessTokenFactory: () => this.userService.getUser() // Gửi token qua header của HTTP request
    })
   
    .build();
    this.connection.start().then(() => {
      console.log('SignalR Started...')
      this.roomList();
      this.userList();
    }).catch((err:any) => {
      console.error(err);
    });

    this.connection.on("newMessage", (messageView:any) => {
      let isMine = messageView.user === this.myName;
      let message = new ChatMessage(messageView.content, messageView.timestamp,
        messageView.user, isMine, messageView.avartar);
      this.chatMessages.push(message);
      // const chatBody = document.querySelector('.chat-body');
      // if (chatBody) {
      //   chatBody.scrollTop = chatBody.scrollHeight;
      // }
    });

    this.connection.on("getProfileInfo", (displayName:any, avatar:any) => {
      this.myName = displayName;
      this.myAvatar = avatar;
      this.isLoading = false;
    });
    this.connection.on("removeUser", (user:any) => {
      this.userRemoved(user.username);
  });
    this.connection.on("addUser", (user:any) => {
      this.userAdded(
        new ChatUser(user.username, user.fullName, user.avatar, user.currentRoom,
          user.device));
    });
    this.connection.on("addChatRoom", (room:any) => {
      this.roomAdded(
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
    
    this.roomService.createMessage(roomName, message).subscribe(res =>{

    })
  }

  sendPrivate(receiver: string, message: string) {
    if (receiver.length > 0 && message.length > 0) {
      this.connection.invoke("SendPrivate", receiver.trim(), message.trim());
    }
  }

  joinRoom(room: ChatRoom) {
    this.connection.invoke("Join", room.name).then(() => {
      this.joinedRoom = room.name;
      this.joinedRoomId = room.id;
      this.userList();
      this.messageHistory();
    });
  }

  roomList() {
    this.http.get<any[]>('https://localhost:7066/api/Room', { headers:this.userService.addHeaderToken() })
      .subscribe(data => {
        this.chatRooms = data.map(room => new ChatRoom(room.id, room.name));
        if (this.chatRooms.length > 0)
          this.joinRoom(this.chatRooms[0]);
      });
  }
  userList() {
    this.connection.invoke("GetUsers", this.joinedRoom).then((result:any) => {
      this.chatUsers = result.map((user:any) => new ChatUser(
        user.username,
        user.fullName,
        user.avatar == null ? "default-avatar.png" : user.avatar,
        user.currentRoom,
        user.device
      ));
    });
  }
  createRoom() {
    this.roomService.createRoom(this.roomCreate)
    .subscribe(res =>{
      alert("Tạo room thành công");
      console.log(res);
    })
  }
  editRoom() {
    const roomId = this.joinedRoomId;
    const roomName = (<HTMLInputElement>document.getElementById("newRoomName")).value;
    fetch('/api/Rooms/' + roomId, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: roomId, name: roomName })
    });
  }
  deleteRoom() {
    fetch('/api/Rooms/' + this.joinedRoomId, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: this.joinedRoomId })
    });
  }
  messageHistory() {
    this.http.get<any[]>('https://localhost:7066/api/Messages/Room/' + this.joinedRoom, { headers:this.userService.addHeaderToken() })
      .subscribe(data => {
        this.chatMessages = data.map(message => {
          const isMine = message.user === this.myName;
          return new ChatMessage(
            message.content,
            new Date(message.timestamp),
            message.user,
            isMine,
            message.avatar
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
    const roomIndex = this.chatRooms.findIndex(room => room.id === updatedRoom.id);
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

// Định nghĩa class ChatRoom
class ChatRoom {
  constructor(public id: string, public name: string) { }
}

// Định nghĩa class ChatUser
class ChatUser {
  constructor(
    public userName: string,
    public displayName: string,
    public avatar: string,
    public currentRoom: string,
    public device: string
  ) { }
}

// Định nghĩa class ChatMessage
class ChatMessage {
  constructor(
    public content: string,
    public timestamp: Date,
    public user: string,
    public isMine: boolean,
    public avartar: string
  ) { }
}
