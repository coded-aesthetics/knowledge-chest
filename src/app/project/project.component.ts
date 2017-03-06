import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import { ProjectService } from '../project.service';
import { Project } from '../domain/project';
import {TaskService} from "app/task.service";
import {SkillService} from "app/skill.service";
import {Subscription} from "rxjs";
import {ArticleService} from "app/article.service";
import {Article} from "app/domain/article";
import {Task} from "app/domain/task";
import {Skill} from "app/domain/skill";

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {

  private skills:Skill[] = [];
  title = 'app works!';
  articleTask:Task = null;

  @Input() project: Project;
  @Output() taskAdded = new EventEmitter<any>();
  @Output() taskDeleted = new EventEmitter<any>();
  @Output() projectDeleted = new EventEmitter<Project>();

  showArticleModal:boolean = false;

  subscription:Subscription = null;

  constructor(private projectService:ProjectService, private articleService:ArticleService, private taskService:TaskService, private skillService:SkillService) {
    this.subscription = skillService.newSkillsAvailable$.subscribe(
      skills => {
        this.skills = skills;
      });
    if (skillService.skills) {
      this.skills = skillService.skills;
    }
  }

  getProjects():void {

  }

  ngOnInit(): void {
    this.getProjects();
  }

  addNewTask(task:any) {
    this.taskService.addTask(this.project, task).subscribe(
      () => {this.taskAdded.emit(task)},
      () => {}
    );
  }

  deleteTask(task:any) {
    this.taskDeleted.emit(task);
  }

  deleteProject() {
    this.projectService.deleteProject(this.project).subscribe(
      () => {this.projectDeleted.emit(this.project)},
      () => {}
    )
  }

  highlightSkills() {
    this.subscription = this.skillService.fetchSkillIdsByProject(this.project).subscribe();
  }

  dehighlightSkills() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.skillService.dehighlightSkills();
  }

  openArticleModal(task:Task) {
    this.showArticleModal=true;
    this.articleTask = task;
  }

  articleModalHidden() {
    console.log("modalHidden");
    this.showArticleModal=false;
  }

  articleModalShow() {
    console.log("shown");
  }

  articleModalSubmitted(article:Article) {
    this.articleService.addArticle(article, this.project, this.articleTask, null).subscribe();
  }
}
