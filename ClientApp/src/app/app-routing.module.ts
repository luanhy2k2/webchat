import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ChatComponent } from './chat/chat.component';
import { SignUpComponent } from './sign-up/sign-up.component';

const routes: Routes = [
  {
    path:'login', 
    component:LoginComponent},
  {
    path:'chat',
    component:ChatComponent
  },
  {
    path:'signUp',
    component:SignUpComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
