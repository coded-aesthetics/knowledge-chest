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

  showArticleModal:boolean = false;

  constructor(private skillService:SkillService, private taskService:TaskService, private projectService:ProjectService, private articleService:ArticleService) {
    this.subscription = skillService.newSkillsAvailable$.subscribe(
      skills => {
        this.skills = skills;
      });
  }

  ngOnInit() {
    this.articleService.fetchArticles().subscribe(
      (articlesHal) => {
        this.articles = articlesHal.getEmbedded("articles");
        console.log(this.articles);
      }
    );
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
