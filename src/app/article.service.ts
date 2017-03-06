import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions} from "@angular/http";
import {Article} from "app/domain/article";
import {Observable} from "rxjs";
import {Task} from "app/domain/task";
import {Project} from "app/domain/project";
import {Workpaket} from "app/domain/workpaket";
import {Hal} from "app/domain/hal";

@Injectable()
export class ArticleService {

  constructor(private http:Http) {
  }

  fetchArticles(): Observable<Hal> {
    return this.http.get("http://localhost:8081/articles")
      .map( (data) => {
        var d = data.json();
        if (d._embedded) {
          if (d._embedded.articles) {
            d._embedded.articles = d._embedded.articles.map((a) => {
              return new Article(a);
            });
          }
        }
        return new Hal(d);
      })
      .catch((error:any) => Observable.throw(error || 'Server error'));
  }

  addArticle(article:Article, project:Project, task:Task, workPaket:Workpaket) {
    var h:Headers = new Headers({"Content-Type":'application/json'});
    var options:RequestOptions = new RequestOptions( { headers: h } );
    let skillHrefs = [];
    if (article._embedded) {
      if (article._embedded.skills) {
        for (let skill of article._embedded.skills) {
          skillHrefs.push(skill.getLinkHref());
        }
      }
    }
    let a = {headline:article.headline,text:article.text,date:new Date(),skills:skillHrefs,task:null,project:null,workPaket:null};
    if (project) {
      a.project = project.getLinkHref();
    }
    if (task) {
      a.task = task.getLinkHref();
    }
    if (workPaket) {
      a.workPaket = workPaket.getLinkHref();
    }
    if (a.workPaket == null) {
      delete a.workPaket;
    }
    if (a.task == null) {
      delete a.task;
    }
    if (a.project == null) {
      delete a.project;
    }
    return this.http.post("http://localhost:8081/articles", JSON.stringify(a), options)
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

}
