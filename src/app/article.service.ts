import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions} from "@angular/http";
import {Article} from "app/domain/article";
import {Observable, Subject} from "rxjs";
import {Task} from "app/domain/task";
import {Project} from "app/domain/project";
import {Workpaket} from "app/domain/workpaket";
import {Hal} from "app/domain/hal";
import {Skill} from "app/domain/skill";
import {environment} from 'environments/environment';

@Injectable()
export class ArticleService {

  public hal:Hal = new Hal({_embedded:{articles:[]},_links:{}});
  public articles:Article[] = [];

  private newArticlesAvailableSource = new Subject<Article[]>();

  newArticlesAvailable$ = this.newArticlesAvailableSource.asObservable();

  constructor(private http:Http) {
  }

  fetchArticles(): Observable<Hal> {
    return this.http.get(environment.serverRoot+"/articles",{ withCredentials: true })
      .map( (data) => {
        var d = data.json();
        if (d._embedded) {
          if (d._embedded.articles) {
            d._embedded.articles = d._embedded.articles.map((a) => {
              return new Article(a);
            });
          }
        }
        this.hal = new Hal(d);
        this.articles = this.hal.getEmbedded("articles");
        this.newArticlesAvailableSource.next(this.articles);
        return this.hal;
      })
      .catch((error:any) => Observable.throw(error || 'Server error'));
  }

  fetchArticlesByProject(project:Project):Observable<Hal> {
    return this.http.get(environment.serverRoot+"/articles/search/findAllByProjectId?projectId="+project.id,{ withCredentials: true })
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

  fetchArticlesBySkill(skill:Skill):Observable<Hal> {
    return this.http.get(environment.serverRoot+"/articles/search/findAllBySkillId?skillId="+skill.id,{ withCredentials: true })
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

  deleteArticle(article:Article): Observable<any> {
    return this.http.delete(article.getLinkHref("self", true),{ withCredentials: true })
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

  putArticle(article:Article) {
    var h:Headers = new Headers({"Content-Type":'application/json'});
    var options:RequestOptions = new RequestOptions( { headers: h, withCredentials: true } );
    let skillHrefs = [];
    if (article._embedded) {
      if (article._embedded.skills) {
        for (let skill of article._embedded.skills) {
          skillHrefs.push(skill.getLinkHref("self", true));
        }
      }
    }
    this.http.put(environment.serverRoot+"/articles/6/skills", JSON.stringify(skillHrefs), options)
      .catch((error:any) => Observable.throw(error.json().error || 'Server error')).subscribe();
    let a = {headline:article.headline,text:article.text,date:new Date(),skills:skillHrefs,task:null,project:null,workPaket:null};
    return this.http.put(article.getLinkHref(), JSON.stringify(a), options)
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

  addArticle(article:Article, project:Project, task:Task, workPaket:Workpaket) {
    var h:Headers = new Headers({"Content-Type":'application/json'});
    var options:RequestOptions = new RequestOptions( { headers: h, withCredentials: true } );
    let skillHrefs = [];
    if (article._embedded) {
      if (article._embedded.skills) {
        for (let skill of article._embedded.skills) {
          skillHrefs.push(skill.getLinkHref("self", true));
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
    return this.http.post(environment.serverRoot+"/articles", JSON.stringify(a), options)
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

}
