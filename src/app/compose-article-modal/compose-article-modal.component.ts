import {Component, OnInit, Output, Input, AfterViewInit, EventEmitter, ViewChild, OnChanges} from '@angular/core';
import {Skill} from "app/domain/skill";
import {ModalDirective} from "ng2-bootstrap";
import {Article} from "app/domain/article";

@Component({
  selector: 'app-compose-article-modal',
  templateUrl: './compose-article-modal.component.html',
  styleUrls: ['./compose-article-modal.component.css']
})
export class ComposeArticleModalComponent implements OnInit,AfterViewInit,OnChanges {

  @ViewChild('lgModal') lgModal:ModalDirective;
  @Output() onShow = new EventEmitter<any>();
  @Output() onHide = new EventEmitter<any>();
  //TODO: change to article
  @Output() modalSubmit = new EventEmitter<Article>();

  @Input() article:Article;

  @Input() skills:Skill[];

  headline:string = "";

  associatedSkills:any[] = [{skill:null}];

  htmlContent:string = "";

  public showModal:boolean = true;

  private description:string = "";
  private date:Date = new Date();

  constructor() {
  }

  onHidden() {
    console.log("onHidden");
    this.onHide.emit("hidden");
  }

  ngAfterViewInit() {
    this.lgModal.show();
    this.onShow.emit("shown");
  }

  addAssociatedSkill() {
    this.associatedSkills.push({skill:null});
  }

  ngOnChanges() {
    this.headline = "";
    this.htmlContent = "";
    this.associatedSkills = [{skill:null}];
    this.date = new Date();
    console.log("gnOnChanges", this.article);
    if (this.article) {
      this.headline = this.article.headline;
      this.htmlContent = this.article.text;
      this.associatedSkills = [];
      for (let skill of this.article.getEmbedded("skills")) {
        this.associatedSkills.push({skill});
      }
      this.date = this.article.date;
    }
  }

  ngOnInit() {

    /*this.skillService.fetchSkills().subscribe(
     (hal) => {this.skills = hal.getEmbedded("skills")},
     () => {}
     );*/
  }

  onSubmit() {
    let articleObj = {_embedded:{skills:[]},headline:this.headline,text:this.htmlContent,date:new Date()};
    for (let as of this.associatedSkills) {
      articleObj._embedded.skills.push(as.skill);
    }
    let article:Article = new Article(articleObj);
    if (this.article) {
      if (!article._links) {
        article._links = {};
      }
      article._links.self = this.article._links.self;
      article._embedded.task = this.article._embedded.task;
    }
    this.modalSubmit.emit(article);
    this.lgModal.hide();
  }

  onContentChanged(obj) {
    this.htmlContent = obj.html;
  }

}
