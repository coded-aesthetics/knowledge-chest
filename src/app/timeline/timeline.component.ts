import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as moment from 'moment';

import {WorkPaketService} from "app/work-paket.service";
import {Workpaket} from "app/domain/workpaket";
import {SkillService} from "app/skill.service";
import {Skill} from "app/domain/skill";
import {Hal} from "app/domain/hal";
import {ArticleService} from "app/article.service";
import {Article} from "app/domain/article";
import {VisTimelineItems, VisTimelineItem, VisTimelineOptions, VisTimelineService} from "ng2-vis/components/timeline";
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
  private tlis:VisTimelineItem[];

  private filterSkill:Skill = null;

  events = [];

  constructor(private workPaketService:WorkPaketService, private articleService:ArticleService, private timelineService:VisTimelineService,private skillService:SkillService) {
    skillService.newFilterSkillAvailable$.subscribe((skill:Skill) => {
      this.filterSkill = skill;
      this.createEvents(this.workPakets, this.articles);
    });
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

  getItemCountInRange(start:Date, end:Date):number {
    let tlisFiltered = this.tlis.filter((tli:VisTimelineItem) => {
      let s = tli.start as Date;
      return s.getTime() > start.getTime() && s.getTime() < end.getTime();
    });
    return tlisFiltered.length;
  }

  initialized(event:any) {
    console.log("init");
    let evt = this.timelineService.on(this.visTimeline, 'rangechanged');
    this.timelineService.rangechanged.subscribe((event:any) => {
      console.log(this.getItemCountInRange(event[1].start, event[1].end));
    });
  }

  createEvents(workPakets:Workpaket[], articles:Article[]) {
    console.log("createEvents", workPakets);
    if (workPakets) {
      this.workPakets = workPakets;
    }
    if (articles) {
      this.articles = articles;
    }
    this.tlis = [];
    let events:any[] = [];
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
              tli.id = this.tlis.length +1;
              tli.start = startMoment.toDate();
              //tli.end = endMoment.unix();
              tli.content = "Workpaket: " + workPaket.getEmbedded("task").name + " - " + workPaket.description;
              //tli.style = "background-color: " + skill.color + ";";
              this.tlis.push(tli);
              events.push({
                type:"SkillHour",
                skill:skill,
                hours:skillHour.hours,
                workPaket:workPaket,
                start:tli.start
              });
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
          for (let skill of article.getEmbedded("skills")) {
            events.push({
              type: "Article",
              article: article,
              skill: skill,
              start: startMoment.toDate()
            });
          }
        }
        let tli:VisTimelineItem = {} as VisTimelineItem;
        tli.id = this.tlis.length +1;
        tli.start = startMoment.toDate();
        //tli.end = endMoment.unix();
        tli.content = title;
        //tli.style = "background-color: " + color + ";";
        this.tlis.push(tli);

      }
    }
    events.sort((e1, e2) => {
      return e1.start.getTime()-e2.start.getTime();
    });
    let clusters = [];
    if (events.length > 0) {
      let minDate = events[0].start.getTime();
      let maxDate = events[events.length - 1].start.getTime();
      let curClusterStartDate = minDate;
      let curClusterEndDate = curClusterStartDate + 1000 * 60 * 60 * 24;
      let curCluster = {
        eventCount: 0,
        start: new Date(curClusterStartDate),
        end: new Date(curClusterEndDate),
        skills: {}
      } as {eventCount: number, start: Date, end: Date, skills: any};

      for (let event of events) {
        let t = event.start.getTime();
        if (t > curClusterEndDate) {
          curClusterStartDate = curClusterEndDate;
          curClusterEndDate = curClusterStartDate + 1000 * 60 * 60 * 24;

          if (curCluster.eventCount > 0) {
            clusters.push(curCluster);
          }
          curCluster = {
            eventCount: 0,
            start: event.start,
            end: new Date(curClusterEndDate),
            skills: {}
          };
        }
        if (this.filterSkill !== null) {
          if (this.filterSkill.id !== event.skill.id) {
            continue;
          }
        }
        if (!curCluster.skills[event.skill.name]) {
          curCluster.skills[event.skill.name] = {skill:event.skill};
        }
        let curSkills = curCluster.skills[event.skill.name];
        if (event.type == "SkillHour") {
          if (curSkills.hours === undefined) {
            curSkills.hours = event.hours;
          } else {
            curSkills.hours += event.hours;
          }
        }
        if (event.type == "Article") {
          if (curSkills.articleCount === undefined) {
            curSkills.articleCount = 1;
          } else {
            curSkills.articleCount++;
          }
        }
        curCluster.end = event.start;
        ++curCluster.eventCount;
      }
      if (curCluster.eventCount > 0) {
        clusters.push(curCluster);
      }
    }
    this.tlis = [];
    for (let cluster of clusters) {
      let content:string = "";
      let hasContent = false;
      for (let key in cluster.skills) {
        let cur = cluster.skills[key];
        if (hasContent) {
          content += "<br/>";
        }
        content += "<strong style='color:"+cur.skill.color+";'>"+key + "</strong>: ";
        let hasHours = false;
        if (cur.hours !== undefined) {
          content += cur.hours + " h";
          hasHours = true;
        }
        if (cur.articleCount !== undefined) {
          if (hasHours) {
            content += ", ";

          }
          content += cur.articleCount + " article(s)";
        }
        hasContent = true;

      }
      let tli:VisTimelineItem = {} as VisTimelineItem;
      tli.id = this.tlis.length +1;
      tli.start = new Date((cluster.start.getTime() + cluster.end.getTime()) / 2);
      //tli.end = cluster.end;
      tli.content = content;
      //tli.style = "background-color: " + color + ";";
      this.tlis.push(tli);

    }
    this.timelineItems = new VisTimelineItems(this.tlis);
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
