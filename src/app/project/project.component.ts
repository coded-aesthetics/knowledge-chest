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
import {ArticleModalListener} from "app/helpers/article-modal-listener";

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent extends ArticleModalListener implements OnInit {

  @Input() project: Project;
  @Output() taskAdded = new EventEmitter<any>();
  @Output() taskDeleted = new EventEmitter<any>();
  @Output() projectDeleted = new EventEmitter<Project>();

  constructor(private projectService:ProjectService, public articleService:ArticleService, private taskService:TaskService, public skillService:SkillService) {
    super(skillService, articleService);
  }

  ngOnInit(): void {
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
}
