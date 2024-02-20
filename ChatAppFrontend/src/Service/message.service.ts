import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { UserService } from "./user.service";

@Injectable({
    providedIn: 'root'
})
export class MessageService {
    constructor(private http: HttpClient, private userService: UserService) { }
    createRoom(room: any): Observable<any> {
        return this.http.post<any>("https://localhost:7066/api/Room", room, { headers: this.userService.addHeaderToken() });
    }
    GetMessageRoom(room: any): Observable<any> {
        const roomName = {
            id: 0,
            name: room
        }
        return this.http.post<any>("https://localhost:7066/api/Message/Room", roomName, { headers: this.userService.addHeaderToken() });
    }


}