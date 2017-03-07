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
