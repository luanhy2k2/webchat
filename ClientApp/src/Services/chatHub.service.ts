import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as signalR from '@microsoft/signalr';
import { UserService } from './user.service';
import { ChatRoom } from 'src/Model/ChatRoom.model';
import { ChatUser } from 'src/Model/ChatUser.model';


@Injectable({
  providedIn: 'root'
})
export class ChatHubService {
  private connection!: signalR.HubConnection;

  constructor(private http: HttpClient, private userService: UserService) { }

  startConnection(): void {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7066/chatHub", {
        accessTokenFactory: () => this.userService.getUser() // Send token through HTTP request header
      })
      .build();

    this.connection.start().then(() => {
      console.log('SignalR Started...');
    }).catch((err: any) => {
      console.error(err);
    });
  }

  addNewMessageListener(callback: (messageView: any) => void): void {
    this.connection.on("newMessage", callback);
  }

   addProfileInfoListener(callback: (displayName: any, avatar: any) => void): void {
    this.connection.on("getProfileInfo", callback);
  }

  addRemoveUserListener(callback: (user: any) => void): void {
    this.connection.on("removeUser", callback);
  }

  addAddUserListener(callback: (user: any) => void): void {
    this.connection.on("addUser", callback);
  }
  addEditRoomListener(callback: (room: any) => void): void {
    this.connection.on("updateChatRoom", callback);
    console.log(this.connection.on("updateChatRoom", callback))
  }
  addChatRoomListener(callback: (room: any) => void): void {
    this.connection.on("addChatRoom", callback);
  }
  addDeleteRoomListener(callback: (roomId: any) => void): void {
    this.connection.on("removeChatRoom", callback);
  }
  joinRoom(roomName: string) {
    return  this.connection.invoke("Join", roomName);
  }
  sendPrivate(receiver: string, message: string): Promise<void> {
    if (receiver.length > 0 && message.length > 0) {
      return this.connection.invoke("SendPrivate", receiver.trim(), message.trim());
    } else {
      return Promise.reject("Receiver or message is empty");
    }
  }
  getUserList(roomName: string): Promise<ChatUser[]> {
    return this.connection.invoke("GetUsers", roomName);
  }
}
