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

@Component({
  selector: 'app-project-info',
  templateUrl: './project-info.component.html',
  styleUrls: ['./project-info.component.css']
})
export class ProjectInfoComponent implements OnInit {

  @Input() id:number;

  private subscription:Subscription;
  private skills:Skill[] = [];
  private project:Project = new Project({name:""});
  private articles:Article[];
  private articleTask:Task;

  private editArticle:Article = null;

  showArticleModal:boolean = false;

  constructor(private skillService:SkillService, private taskService:TaskService, private projectService:ProjectService, private articleService:ArticleService) {
    this.subscription = skillService.newSkillsAvailable$.subscribe(
      skills => {
        this.skills = skills;
      });
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

  openEditArticleModal(article:Article) {
    this.editArticle = article;
    this.showArticleModal = true;
  }

  openArticleModal(task:Task) {
    this.showArticleModal = true;
    this.articleTask = task;
  }

  articleModalHidden() {
    console.log("modalHidden");
    this.showArticleModal=false;
    this.editArticle = null;
  }

  articleModalShow() {
    console.log("shown");
  }

  articleModalSubmitted(article:Article) {
    if (this.editArticle) {
      this.articleService.deleteArticle(article).subscribe(
        () => {
          this.articleService.addArticle(article, this.project, new Task(article.getEmbedded("task")), null).subscribe(
            () => {
              this.fetchProject();
            }
          );
        }
      )
    }
    else {
      this.articleService.addArticle(article, this.project, this.articleTask, null).subscribe(
        () => {
          this.fetchProject();
        }
      );
    }
  }

  articleDeleted() {
    this.fetchProject();
  }
}
