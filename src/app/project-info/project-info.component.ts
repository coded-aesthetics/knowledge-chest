import {Component, OnInit, Input} from '@angular/core';
import {Project} from "app/domain/project";
import {Subscription} from "rxjs";
import {Skill} from "app/domain/skill";
import {SkillService} from "app/skill.service";
import {TaskService} from "app/task.service";
import {ProjectService} from "app/project.service";
import {ArticleService} from "app/article.service";
import {Article} from "app/domain/article";
import {Task} from "app/domain/task";
import {ArticleModalListener} from "app/helpers/article-modal-listener";

@Component({
  selector: 'app-project-info',
  templateUrl: './project-info.component.html',
  styleUrls: ['./project-info.component.css']
})
export class ProjectInfoComponent extends ArticleModalListener implements OnInit {

  @Input() id:number;

  private articles:Article[];

  constructor(private taskService:TaskService, private projectService:ProjectService, public skillService:SkillService, public articleService:ArticleService) {
    super(skillService, articleService);
  }

  ngOnInit() {
    if (this.skillService.skills) {
      this.skills = this.skillService.skills;
    }
    this.skillService.fetchSkills().subscribe();
    this.fetchProject();
  }

  fetchProject() {
    this.projectService.getProject(this.id).subscribe(
      (project) => {
        this.project = project;
        console.log(this.project);
        this.articleService.fetchArticlesByProject(this.project).subscribe(
          (articlesHal) => {
            this.articles = articlesHal.getEmbedded("articles");
          }
        );
      }
    );
  }

  addNewTask(task:any) {
    this.taskService.addTask(this.project, task).subscribe(
      () => {this.fetchProject();},
      () => {}
    );
  }

  deleteTask(task:any) {
    this.fetchProject();
  }

  afterArticlePersisted() {
    this.fetchProject();
  }

  articleDeleted() {
    this.fetchProject();
  }
}
