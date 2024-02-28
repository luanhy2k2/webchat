import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private http: HttpClient) { }
    login(email: string, password: string): Observable<any> {

        return this.http.post<any>("https://localhost:7066/api/User/login", { email, password });
    }
    SignUp(email:string, password:string, fullName:string,avartar: File): Observable<any> {
        const formData: FormData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        formData.append('fullName', fullName);
        formData.append('avartar', avartar);
        console.log(formData)
        return this.http.post<any>("https://localhost:7066/api/User/signUp",formData);
      }
    getUser():any {
        var userString = localStorage.getItem('user');
        return userString;
    }
    addHeaderToken() {
        const user = this.getUser();
        const headers = new HttpHeaders({
            // 'Content-Type': 'application/json',
            'Authorization': `Bearer ${user}`
        });
        return headers;
    }
    addHeaderTokenFile() {
        // Thêm mã token vào header của yêu cầu
        const user = this.getUser();// Thay YOUR_ACCESS_TOKEN bằng mã token thực tế của bạn
        return new HttpHeaders({
          'Authorization': `Bearer ${user}`,
         // Đảm bảo header Content-Type là multipart/form-data
        });
      }

}