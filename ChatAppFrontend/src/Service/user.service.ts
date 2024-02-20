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
    getUser():any {
        var userString = localStorage.getItem('user');
        return userString;
    }
    addHeaderToken() {
        const user = this.getUser();
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user}`
        });
        return headers;
    }

}