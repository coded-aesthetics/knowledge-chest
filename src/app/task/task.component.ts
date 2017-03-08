import {Component, OnInit, Input, Output, EventEmitter, ViewContainerRef, OnDestroy} from '@angular/core';

import { Task } from '../domain/task';
import {SkillService} from "app/skill.service";
import {Subscription} from "rxjs";
import {Skill} from "app/domain/skill";
import {Workpaket} from "app/domain/workpaket";
import {TaskService} from "app/task.service";
import {WorkPaketService} from "app/work-paket.service";
import {Article} from "app/domain/article";
import {ArticleService} from "app/article.service";

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit, OnDestroy {

  @Input() task:Task;
  @Output() deleteTaskEE = new EventEmitter<Task>();

  showModal:boolean = false;

  subscription:Subscription;
  taskSubscription:Subscription;
  skills:Skill[];

  @Output() openArticleModalEE = new EventEmitter<Task>();

  openArticleModal() {
    this.openArticleModalEE.emit(this.task);
  }

  highlightColor = null;

  constructor(private skillService:SkillService, private taskService:TaskService, private workPaketService:WorkPaketService) {
    this.subscription = skillService.newSkillsAvailable$.subscribe(
      skills => {
        this.skills = skills;
      });
    this.taskSubscription = taskService.newHighlightTasksAvailable$.subscribe(
      (highlightTasks) => {
        this.highlightColor = null;
        for (let task of highlightTasks.tasks) {
          if (task.id == this.task.id) {
            this.highlightColor = highlightTasks.color;
          }
        }
      },
      () => {}
    );
    if (skillService.skills) {
      this.skills = skillService.skills;
    }
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.taskSubscription.unsubscribe();
  }

  deleteTask() {
    this.deleteTaskEE.emit(this.task);
  }

  openLogModal() {
    this.showModal=true;
  }

  modalHidden() {
    this.showModal=false;
  }

  modalShow() {
    console.log("shown");
  }

  modalSubmitted(workPaket:Workpaket) {
    this.workPaketService.addWorkPaket(this.task, workPaket).subscribe(
      (data) => {
        let wp:Workpaket = new Workpaket(JSON.parse(data._body));
        let skillHours = workPaket.getEmbedded("skillHours");
        var numChecked:number = 0;
        let checkFinished = () => {
          if (++numChecked >= skillHours.length) {
            this.workPaketService.fetchWorkPakets().subscribe();
          }
        }
        for (let skillHour of skillHours) {
          this.workPaketService.addSkillHour(wp, skillHour).subscribe(
            () => {console.log("went");checkFinished();},
            () => {console.log("died");}
          );
        }
      },
      ()=>{console.log("died")}
    );
  }


}
