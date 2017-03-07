import {Component, ViewChild, ElementRef, Input, OnInit} from '@angular/core';
import {Article} from "app/domain/article";
import * as moment from 'moment';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})

export class ArticleComponent extends OnInit {

  @Input() article:Article;

  @ViewChild('dataContainer') dataContainer: ElementRef;

  ngOnInit() {
    this.dataContainer.nativeElement.innerHTML = this.article.text;
  }

  formatDate(date:Date):string {
    return moment(date).format('DD.MM.YYYY - HH:mm');
  }

}
