import { Injectable } from '@angular/core';
import {Workpaket} from "app/domain/workpaket";
import {SkillHour} from "app/domain/skill-hour";
import {Observable, Subject} from "rxjs";
import {Http, Headers, RequestOptions} from "@angular/http";
import {Task} from "app/domain/task";
import {Hal} from "app/domain/hal";

@Injectable()
export class WorkPaketService {

  public hal:Hal = new Hal({_embedded:{skillHours:[]},_links:{}});
  public workPakets:Workpaket[] = [];

  private newWorkPaketsAvailableSource = new Subject<Workpaket[]>();

  newWorkPaketsAvailable$ = this.newWorkPaketsAvailableSource.asObservable();

  constructor(private http:Http) { }

  fetchWorkPakets(): Observable<Hal> {
    return this.http.get("http://localhost:8081/workPakets",{ withCredentials: true })
      .map((data) => {
        var d = data.json();
        if (d._embedded) {
          if (d._embedded.workPakets) {
            d._embedded.workPakets = d._embedded.workPakets.map((wp) => {
              return new Workpaket(wp);
            });
          }
        }
        this.hal = new Hal(d);
        this.workPakets = this.hal.getEmbedded("workPakets");
        this.newWorkPaketsAvailableSource.next(this.workPakets);
        return this.hal;
      })
      .catch((error: any) => {
        console.log(error);
        return Observable.throw(error.json().error || 'Server error');
      });
  }

  addSkillHour(workPaket:Workpaket, skillHour:SkillHour): Observable<any> {
    var h:Headers = new Headers({"Content-Type":'application/json'});
    var options:RequestOptions = new RequestOptions( { headers: h, withCredentials: true } );
    let sh = {hours:skillHour.hours+0.0,workPaket:workPaket.getLinkHref("self"),skill:skillHour.skill.getLinkHref("self")};
    return this.http.post("http://localhost:8081/skillHours", JSON.stringify(sh), options)
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

  addWorkPaket(task:Task, workPaket:Workpaket): Observable<any> {
    var h:Headers = new Headers({"Content-Type":'application/json'});
    var options:RequestOptions = new RequestOptions( { headers: h, withCredentials: true } );
    let wp = {description:workPaket.description,date:workPaket.date,task:task.getLinkHref("self",true)};
    return this.http.post("http://localhost:8081/workPakets", JSON.stringify(wp), options)
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }
}
