import { Injectable } from '@angular/core';
import { Login } from './login';

import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';

import {Observable} from 'rxjs/Rx';
import {environment} from 'environments/environment';

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
    let options       = new RequestOptions({ headers: headers , withCredentials: true}); // Create a request option

    return this.http.post(environment.serverRoot+"/login", params, options) // ...using post request
      .map((res:Response) => "") // ...and calling .json() on the response to return data
      .catch((error:any) => {
        console.log(error);
        return Observable.throw(error || 'Server error');
      });
  }

}
