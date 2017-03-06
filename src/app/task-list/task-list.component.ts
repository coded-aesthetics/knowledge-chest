import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';

import { Task } from '../domain/task';
import {TaskService} from "app/task.service";

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {

  public newTaskName:string;

  @Input() tasks:Task[];
  @Output() addTaskEE = new EventEmitter<any>();
  @Output() deleteTaskEE = new EventEmitter<any>();
  @Output() openArticleModalEE = new EventEmitter<Task>();

  constructor(private taskService:TaskService) { }

  openArticleModal(task:Task) {
    this.openArticleModalEE.emit(task);
  }

  ngOnInit() {
  }

  addTask() {
    this.addTaskEE.emit({name:this.newTaskName});
  }

  deleteTask(task:Task) {
    this.taskService.deleteTask(task).subscribe(
      () => {this.deleteTaskEE.emit(task);},
      () => {console.error("could not delete task");}
    );
  }

}
