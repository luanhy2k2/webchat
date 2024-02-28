import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private http: HttpClient, private userService:UserService) { }

  uploadFile(file: File, roomId:any): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('File', file);
    formData.append('RoomId', roomId);
    console.log(formData)
    return this.http.post<any>("https://localhost:7066/api/UploadFile", formData, {headers:this.userService.addHeaderToken()});
  }
}
