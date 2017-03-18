import {Component, OnInit, Input} from '@angular/core';
import {SkillService} from "app/skill.service";
import {Skill} from "app/domain/skill";
import {ArticleService} from "app/article.service";
import {Article} from "app/domain/article";
import {ArticleModalListener} from "app/helpers/article-modal-listener";

@Component({
  selector: 'app-skill-info',
  templateUrl: './skill-info.component.html',
  styleUrls: ['./skill-info.component.css']
})
export class SkillInfoComponent extends ArticleModalListener implements OnInit {

  @Input() id:number;
  private skill:Skill = new Skill({name:""});
  private articles:Article[];

  constructor(public skillService:SkillService, public articleService:ArticleService) {
    super(skillService, articleService);
  }

  fetchSkill() {
    this.skillService.fetchSkillById(this.id).subscribe(
      (skill:Skill) => {
        this.skill = skill;
        this.articleService.fetchArticlesBySkill(skill).subscribe(
          (articleHal) => {
            this.articles = articleHal.getEmbedded("articles");
            console.log(this.articles);
          }
        );
      }
    );
  }

  afterArticlePersisted() {
    this.fetchSkill();
  }

  ngOnInit() {
    this.fetchSkill();
  }

}
