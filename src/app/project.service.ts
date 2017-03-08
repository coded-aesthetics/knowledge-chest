import { Injectable } from '@angular/core';

import { Http, Response, RequestOptions, Headers } from '@angular/http';

import { Project } from './domain/project';
import { Observable } from 'rxjs/Rx';
import {Hal} from "app/domain/hal";
import {environment} from 'environments/environment';

@Injectable()
export class ProjectService {

  constructor(private http:Http) { }

  getProjects(): Observable<Hal> {
    return this.http.get(environment.serverRoot+"/projects",{ withCredentials: true })
             .map( (data) => {
               var d = data.json();
               if (d._embedded) {
                 if (d._embedded.projects) {
                   d._embedded.projects = d._embedded.projects.map((p) => {
                     return new Project(p);
                   });
                 }
               }
               return new Hal(d);
             })
             .catch((error:any) => Observable.throw(error || 'Server error'));
  }

  fetchProjectsBySkillId(id:number): Observable<Hal> {
    return this.http.get(environment.serverRoot+"/projects/search/findAllBySkillId?skillId=" + id,{ withCredentials: true })
      .map( (data) => {
        var d = data.json();
        if (d._embedded) {
          if (d._embedded.projects) {
            d._embedded.projects = d._embedded.projects.map((p) => {
              return new Project(p);
            });
          }
        }
        return new Hal(d);
      })
      .catch((error:any) => Observable.throw(error || 'Server error'));
  }

  getProject(id:number): Observable<Project> {
    return this.http.get(environment.serverRoot+"/projects/" + id,{ withCredentials: true })
      .map( (data) => {
        var d = data.json();
        return new Project(d);
      })
      .catch((error:any) => Observable.throw(error || 'Server error'));
  }

  addProject(project:any): Observable<any> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers, withCredentials: true });
    return this.http.post(environment.serverRoot+"/projects", JSON.stringify(project), options)
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

  deleteProject(project:Project): Observable<any> {
    return this.http.delete(project.getLinkHref(),{ withCredentials: true })
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

}
