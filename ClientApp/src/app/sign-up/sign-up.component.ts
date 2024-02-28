import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/Services/user.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  constructor(private userService:UserService, private router:Router){}
  email:any;
  password:any;
  fullName: string = "";
  avatar!: File; 
  onFileChanged(event: any) {
    this.avatar = event.target.files[0];
  }
  SignUp(){
    this.userService.SignUp(this.email,this.password, this.fullName,this.avatar).subscribe(res =>{
      alert("Sign up success!");
      this.userService.login(this.email, this.password).subscribe(res =>{
        alert(this.userService.getUser());
        localStorage.setItem('user', res.token);
        this.router.navigate(['/chat']);
      })
    })
  }
}
