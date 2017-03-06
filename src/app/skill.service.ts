import { Injectable } from '@angular/core';

import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Skill } from './domain/skill';
import {Observable, Subject} from 'rxjs/Rx';
import { Hal } from "app/domain/hal";
import {Project} from "app/domain/project";

@Injectable()
export class SkillService {

  public hal:Hal = new Hal({_embedded:{skills:[]},_links:{}});
  public skills:Skill[];

  private newSkillsAvailableSource = new Subject<Skill[]>();

  newSkillsAvailable$ = this.newSkillsAvailableSource.asObservable();

  private fetchInProgress:boolean = false;

  private newHighlightSkillsAvailableSource = new Subject<number[]>();

  newHighlightSkillsAvailable$ = this.newHighlightSkillsAvailableSource.asObservable();


  constructor(private http:Http) {
  }

  dehighlightSkills() {
    this.newHighlightSkillsAvailableSource.next([]);
  }

  fetchSkillIdsByProject(project:Project): Observable<number[]> {
    return this.http.get("http://localhost:8081/getSkillIdsByProject?projectId="+project.id)
      .map( (data) => {
        var d = data.json();
        this.newHighlightSkillsAvailableSource.next(d);
        return d;
      })
      .catch((error:any) => Observable.throw(error || 'Server error'));
  }

  fetchSkills(): Observable<Hal> {
    return this.http.get("http://localhost:8081/skills")
      .map((data) => {
        var d = data.json();
        if (d._embedded) {
          if (d._embedded.skills) {
            d._embedded.skills = d._embedded.skills.map((s) => {
              return new Skill(s);
            });
          }
        }
        this.hal = new Hal(d);
        console.log("fetched skills", this.hal);
        this.skills = this.hal.getEmbedded("skills");
        this.newSkillsAvailableSource.next(this.skills);
        return this.hal;
      })
      .catch((error: any) => {
        return Observable.throw(error.json().error || 'Server error');
      });
  }

  addSkill(skill:any): Observable<any> {
    var h:Headers = new Headers({"Content-Type":'application/json'});
    var options:RequestOptions = new RequestOptions( { headers: h } );
    var color = (Math.round(Math.random() * 0xFFFFFF)).toString(16);
    while(color.length < 6) {
      color = '0' + color;
    }
    color = '#' + color;
    skill.color = color;
    var obs:Observable<any> = this.http.post("http://localhost:8081/skills", JSON.stringify(skill), options).do(
        (data) => {
          this.fetchSkills().subscribe();
        }
      )
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'));

    return obs;
  }

  deleteSkill(skill:Skill): Observable<any> {
    return this.http.delete(skill.getLinkHref()).do(
        (data) => {
          this.fetchSkills().subscribe();
        }
      )
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

  findCachedSkillByHref(href:string) {
    console.log(this.skills, href);
    if (!this.skills) {
      return null;
    }
    for (let skill of this.skills) {
      console.log("gothere");
      if (skill.getLinkHref("self") == href) {
        console.log("returned", skill);
        return skill;
      }
    }
    return null;
  }

}
