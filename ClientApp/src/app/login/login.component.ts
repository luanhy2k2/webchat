import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { UserService } from 'src/Services/user.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private userService:UserService, private router:Router){}
  email:any;
  password:any;
  login(){
    this.userService.login(this.email,this.password).subscribe(res =>{
      alert(this.userService.getUser());
      localStorage.setItem('user', res.token);
      this.router.navigate(['/chat']);
    })
  }

}
