import { Injectable } from '@angular/core';

import {Http, Headers, RequestOptions} from '@angular/http';
import { Task } from './domain/task';
import {Observable, Subject} from 'rxjs/Rx';
import { Hal } from "app/domain/hal";
import {Workpaket} from "app/domain/workpaket";
import {Project} from "app/domain/project";
import {Skill} from "app/domain/skill";

@Injectable()
export class TaskService {

  constructor(private http:Http) { }

  public highlightTasks:Task[];

  private newHighlightTasksAvailableSource = new Subject<any>();

  newHighlightTasksAvailable$ = this.newHighlightTasksAvailableSource.asObservable();

  dehighlightTasks() {
    this.highlightTasks = [];
    this.newHighlightTasksAvailableSource.next({tasks:this.highlightTasks});
  }

  fetchTasksBySkill(skill:Skill):Observable<Task[]> {
    return this.http.get("http://localhost:8081/tasks/search/findAllBySkillId?skillId=" + skill.id,{ withCredentials: true })
      .map( (data) => {
        var d = data.json();
        if (d._embedded) {
          if (d._embedded.tasks) {
            d._embedded.tasks = d._embedded.tasks.map((s) => {
              return new Task(s);
            });
          }
        }
        let hal:Hal = new Hal(d);
        this.highlightTasks = hal.getEmbedded("tasks");
        this.newHighlightTasksAvailableSource.next({color:skill.color, tasks: this.highlightTasks});
        return this.highlightTasks;
      })
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

  fetchTasks(): Observable<Hal> {
    return this.http.get("http://localhost:8081/tasks",{ withCredentials: true })
      .map( (data) => {
        var d = data.json();
        if (d._embedded) {
          if (d._embedded.tasks) {
            d._embedded.tasks = d._embedded.tasks.map((s) => {
              return new Task(s);
            });
          }
        }
        return new Hal(d);
      })
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

  deleteTask(task:Task): Observable<any> {
    return this.http.delete(task.getLinkHref("self", true),{ withCredentials: true })
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

  addTask(project:Project, task:any): Observable<any> {
    var h:Headers = new Headers({"Content-Type":'application/json'});
    var options:RequestOptions = new RequestOptions( { headers: h, withCredentials: true } );
    let t = {name:task.name,done:false,project:project.getLinkHref("self")};
    return this.http.post("http://localhost:8081/tasks", JSON.stringify(t), options)
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

}
