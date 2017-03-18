import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Article} from "app/domain/article";
import * as moment from 'moment';
import {ArticleService} from "app/article.service";

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.css']
})
export class ArticleListComponent implements OnInit {

  @Input() articles:Article[];
  @Output() articleDeleted:EventEmitter<any> = new EventEmitter<any>();
  @Output() editArticleEE:EventEmitter<any> = new EventEmitter<any>();

  constructor(private articleService:ArticleService) { }

  ngOnInit() {
  }

  getArticlesSortedByDateDesc():Article[] {
    if (!this.articles) {
      return [];
    }
    return this.articles.sort((a1, a2) => {

      if (!a1.date || !a2.date) {return -100;}
      let d1 = moment(a1.date).toDate();
      let d2 = moment(a2.date).toDate();
      return d2.getTime() - d1.getTime();
    });
  }

  formatDate(date:Date):string {
    return moment(date).format('DD.MM.YYYY - HH:mm');
  }

  editArticle(article:Article) {
    this.editArticleEE.emit(article);
  }

  deleteArticle(article:Article) {
    this.articleService.deleteArticle(article).subscribe(
      () => {
        this.articleDeleted.emit();
      }
    );
  }
}
