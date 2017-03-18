import {Article} from "app/domain/article";
import {Task} from "app/domain/task";
import {SkillService} from "app/skill.service";
import {ArticleService} from "app/article.service";
import {Project} from "app/domain/project";
import {Subscription} from "rxjs";
import {Skill} from "app/domain/skill";
export class ArticleModalListener {
  private subscription:Subscription;

  protected project:Project = new Project({name:""});
  public articleTask:Task;
  public skills:Skill[];

  public editArticle:Article = null;

  showArticleModal:boolean = false;

  constructor(public skillService:SkillService, public articleService:ArticleService) {
    this.subscription = skillService.newSkillsAvailable$.subscribe(
      skills => {
        this.skills = skills;
      });
    if (skillService.skills) {
      this.skills = skillService.skills;
    }
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

  afterArticlePersisted() {

  }

  articleModalSubmitted(article:Article) {
    if (this.editArticle) {
      this.articleService.deleteArticle(article).subscribe(
        () => {
          this.articleService.addArticle(article, this.project, new Task(article.getEmbedded("task")), null).subscribe(
            () => {
              this.afterArticlePersisted();
            }
          );
        }
      )
    }
    else {
      this.articleService.addArticle(article, this.project, this.articleTask, null).subscribe(
        () => {
          this.afterArticlePersisted();
        }
      );
    }
  }
}
