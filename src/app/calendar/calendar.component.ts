import {Component, OnInit, AfterViewInit} from '@angular/core';
import { CalendarEvent } from 'angular-calendar';

import * as moment from 'moment';

import {WorkPaketService} from "app/work-paket.service";
import {Workpaket} from "app/domain/workpaket";
import {SkillService} from "app/skill.service";
import {Skill} from "app/domain/skill";
import {Hal} from "app/domain/hal";
import {ArticleService} from "app/article.service";
import {Article} from "app/domain/article";

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit, AfterViewInit {
  public viewDate:Date = new Date();
  public workPakets:Workpaket[];
  public articles:Article[];

  events = [];

  constructor(private workPaketService:WorkPaketService, private articleService:ArticleService) {
    console.log("CalendarComp->constructor");
    workPaketService.newWorkPaketsAvailable$.subscribe(
      workPakets => {
        this.createEvents(workPakets, null);
      });
    articleService.newArticlesAvailable$.subscribe(
      articles => {
        this.createEvents(null, articles);
      }
    );
  }

  createEvents(workPakets:Workpaket[], articles:Article[]) {
    console.log("createEvents", workPakets);
    if (workPakets) {
      this.workPakets = workPakets;
    }
    if (articles) {
      this.articles = articles;
    }
    this.events = [];
    if (this.workPakets) {
      for (let workPaket of this.workPakets) {
        let endMoment = moment(workPaket.endDate).add({hours: 12});
        let startMoment = endMoment.subtract({hours: 1});
        let skillHours = workPaket.getEmbedded("skillHours");
        if (skillHours) {
          for (let skillHour of skillHours) {
            console.log(skillHour, skillHour.getLinkHref("skill"));
            let skill: Skill = new Skill(skillHour.skill);
            console.log(skill);
            if (skill) {
              let evt = {
                end: endMoment,
                start: startMoment,
                title: "Workpaket: " + workPaket.getEmbedded("task").name + " - " + workPaket.description,
                color: {
                  primary: skill.color
                }
              };
              this.events.push(evt);
            }
          }
        }
      }
    }
    if (this.articles) {
      console.log("articles", this.articles);
      for (let article of this.articles) {
        let endMoment = moment(article.date);
        let startMoment = endMoment.subtract({hours: 1});
        let title = "Article: ";
        if (article.getEmbedded("task")) {
          title += article.getEmbedded("task").name + " - ";
        }
        title += article.headline;
        let color = '#000000';
        if (article.getEmbedded("skills")) {
          let skills = article.getEmbedded("skills");
          if (skills.length > 0) {
            color = skills[0].color;
          }
        }
        let evt = {
          end: endMoment,
          start: startMoment,
          title: title,
          color: {
            primary: color
          },
          cssClass: 'calendar-article-dot'
        };
        this.events.push(evt);
      }
    }
  }

  ngOnInit() {
    console.log("CalendarComp->onInit");
    let test;
    if (this.workPaketService.workPakets) {
      this.createEvents(this.workPaketService.workPakets, null);
    }
    this.workPaketService.fetchWorkPakets().subscribe(
      (wpHal:Hal) => {
        this.workPakets = wpHal.getEmbedded("workPakets");
      }
    );
    if (this.articleService.articles) {
      this.createEvents(null, this.articleService.articles);
    }
    this.articleService.fetchArticles().subscribe(
      (arHal:Hal) => {
        this.articles = arHal.getEmbedded("articles");
      }
    );
  }

  ngAfterViewInit() {
    console.log("CalendarComp->afterViewInit");
    //this.workPaketService.fetchWorkPakets().subscribe();

  }
  /**
   * {
    start: subDays(startOfDay(new Date()), 1),
    end: addDays(new Date(), 1),
    title: 'A 3 day event',
    color: colors.red,
    actions: this.actions
    }
   * @type {Array}
   */


}
