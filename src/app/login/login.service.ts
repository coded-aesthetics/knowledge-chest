import { Injectable } from '@angular/core';
import { Login } from './login';

import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';

import {Observable} from 'rxjs/Rx';

@Injectable()
export class LoginService {

  constructor(private http:Http) {}

  tryLogin(login:Login) {
    let bodyObj = {username:login.user, password:login.password, code:'', submit:'Submit'}; // Stringify payload

    let params = new URLSearchParams();
    for (let key in bodyObj) {
      if (bodyObj.hasOwnProperty(key)) {
        params.set(key, bodyObj[key])
      }
    }

    let headers      = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' }); // ... Set content type to JSON
    let options       = new RequestOptions({ headers: headers }); // Create a request option

    return this.http.post("http://localhost:8081/login", params, options) // ...using post request
      .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

}
