import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as moment from 'moment';

import {WorkPaketService} from "app/work-paket.service";
import {Workpaket} from "app/domain/workpaket";
import {SkillService} from "app/skill.service";
import {Skill} from "app/domain/skill";
import {Hal} from "app/domain/hal";
import {ArticleService} from "app/article.service";
import {Article} from "app/domain/article";
import {VisTimelineItems, VisTimelineItem, VisTimelineOptions} from "ng2-vis/components/timeline";
import {HeightWidthType, TimelineOptions} from "vis";


@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit, AfterViewInit {

  public viewDate:Date = new Date();
  public workPakets:Workpaket[];
  public timelineItems:VisTimelineItems;
  public timelineOptions:TimelineOptions;
  public visTimeline: string = 'timelineId1';
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
    this.timelineOptions = {showMinorLabels:true, minHeight:210, maxHeight:210, rollingMode:true} as TimelineOptions;
  }

  createEvents(workPakets:Workpaket[], articles:Article[]) {
    console.log("createEvents", workPakets);
    if (workPakets) {
      this.workPakets = workPakets;
    }
    if (articles) {
      this.articles = articles;
    }
    let tlis:VisTimelineItem[] = [];
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
            /*
             interface DataItem {
             className?: string;
             content: string;
             end?: DateType;
             group?: any;
             id?: IdType;
             start: DateType;
             style?: string;
             subgroup?: SubgroupType;
             title?: string;
             type?: string;
             editable?: boolean;
             }
             */
            if (skill) {
              let tli:VisTimelineItem = {} as VisTimelineItem;
              tli.id = tlis.length +1;
              tli.start = startMoment.toDate();
              //tli.end = endMoment.unix();
              tli.content = "Workpaket: " + workPaket.getEmbedded("task").name + " - " + workPaket.description;
              //tli.style = "background-color: " + skill.color + ";";
              tlis.push(tli);
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
        let tli:VisTimelineItem = {} as VisTimelineItem;
        tli.id = tlis.length +1;
        tli.start = startMoment.toDate();
        //tli.end = endMoment.unix();
        tli.content = title;
        //tli.style = "background-color: " + color + ";";
        tlis.push(tli);
      }
    }
    console.log(tlis);
    this.timelineItems = new VisTimelineItems(tlis);
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

}
