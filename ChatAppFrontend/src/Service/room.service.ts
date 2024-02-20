import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { UserService } from "./user.service";

@Injectable({
    providedIn: 'root'
})
export class RoomService {
    constructor(private http: HttpClient, private userService: UserService) { }
    createRoom(room: any): Observable<any> {
        return this.http.post<any>("https://localhost:7066/api/Room", room, { headers: this.userService.addHeaderToken() });
    }
    createMessage(roomName:string, message: string): Observable<any> {
        const req = {
            content: message,
            roomName:roomName
        }
        return this.http.post<any>("https://localhost:7066/api/Messages", req, { headers: this.userService.addHeaderToken() });
    }
    GetMessageRoom(room: any): Observable<any> {
        const roomName = {
            id: 0,
            name: room
        }
        return this.http.post<any>("https://localhost:7066/api/Message/Room", roomName, { headers: this.userService.addHeaderToken() });
    }


}