import { Injectable } from '@angular/core';

import { Http, Response, RequestOptions, Headers } from '@angular/http';

import { Project } from './domain/project';
import { Observable } from 'rxjs/Rx';
import {Hal} from "app/domain/hal";
import {Task} from "app/domain/task";
import {Skill} from "app/domain/skill";

@Injectable()
export class ProjectService {

  constructor(private http:Http) { }

  getProjects(): Observable<Hal> {
    return this.http.get("http://localhost:8081/projects")
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
    return this.http.get("http://localhost:8081/projects/" + id)
      .map( (data) => {
        var d = data.json();
        return new Project(d);
      })
      .catch((error:any) => Observable.throw(error || 'Server error'));
  }

  addProject(project:any): Observable<any> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post("http://localhost:8081/projects", JSON.stringify(project), options)
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

  deleteProject(project:Project): Observable<any> {
    return this.http.delete(project.getLinkHref())
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

}
/*
 {
 "_embedded" : {
 "projects" : [ {
 "name" : "Stereo-Types",
 "id" : 1,
 "tasks" : [ {
 "name" : "Task 2"
 }, {
 "name" : "Task 1"
 }, {
 "name" : "Task 3"
 } ],
 "_links" : {
 "self" : {
 "href" : "http://localhost:8081/projects/1"
 },
 "project" : {
 "href" : "http://localhost:8081/projects/1{?projection}",
 "templated" : true
 },
 "tasks" : {
 "href" : "http://localhost:8081/projects/1/tasks"
 }
 }
 }, {
 "name" : "Blog",
 "id" : 2,
 "tasks" : [ {
 "name" : "Task 2"
 }, {
 "name" : "Task 1"
 }, {
 "name" : "Task 3"
 } ],
 "_links" : {
 "self" : {
 "href" : "http://localhost:8081/projects/2"
 },
 "project" : {
 "href" : "http://localhost:8081/projects/2{?projection}",
 "templated" : true
 },
 "tasks" : {
 "href" : "http://localhost:8081/projects/2/tasks"
 }
 }
 }, {
 "name" : "MusiCookie",
 "id" : 3,
 "tasks" : [ {
 "name" : "Task 3"
 }, {
 "name" : "Task 1"
 } ],
 "_links" : {
 "self" : {
 "href" : "http://localhost:8081/projects/3"
 },
 "project" : {
 "href" : "http://localhost:8081/projects/3{?projection}",
 "templated" : true
 },
 "tasks" : {
 "href" : "http://localhost:8081/projects/3/tasks"
 }
 }
 }, {
 "name" : "BrickScout",
 "id" : 4,
 "tasks" : [ {
 "name" : "Task 1"
 } ],
 "_links" : {
 "self" : {
 "href" : "http://localhost:8081/projects/4"
 },
 "project" : {
 "href" : "http://localhost:8081/projects/4{?projection}",
 "templated" : true
 },
 "tasks" : {
 "href" : "http://localhost:8081/projects/4/tasks"
 }
 }
 }, {
 "name" : "Implenia",
 "id" : 5,
 "tasks" : [ {
 "name" : "Task 2"
 }, {
 "name" : "Task 3"
 }, {
 "name" : "Task 1"
 } ],
 "_links" : {
 "self" : {
 "href" : "http://localhost:8081/projects/5"
 },
 "project" : {
 "href" : "http://localhost:8081/projects/5{?projection}",
 "templated" : true
 },
 "tasks" : {
 "href" : "http://localhost:8081/projects/5/tasks"
 }
 }
 } ]
 },
 "_links" : {
 "self" : {
 "href" : "http://localhost:8081/projects"
 },
 "profile" : {
 "href" : "http://localhost:8081/profile/projects"
 },
 "search" : {
 "href" : "http://localhost:8081/projects/search"
 }
 }
 }

 */
