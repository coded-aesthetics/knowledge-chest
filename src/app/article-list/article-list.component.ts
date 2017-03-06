import {Component, OnInit, Input} from '@angular/core';
import {Article} from "app/domain/article";
import * as moment from 'moment';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.css']
})
export class ArticleListComponent implements OnInit {

  @Input() articles:Article[];

  constructor() { }

  ngOnInit() {
  }

  formatDate(date:Date):string {
    return moment(date).format('DD.MM.YYYY - HH:mm');
  }

}
