import { Component, OnInit } from '@angular/core';

import { Login } from './login';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private loginService:LoginService) {}

  submitted = false;

  model = new Login("jreinsch@gmx.de", "K3n$3n7m3");

  onSubmit() {
    this.submitted = true;
    this.loginService.tryLogin(this.model).subscribe((test) => console.log(test));
  }

  get diagnostic() { return JSON.stringify(this.model); }
}
