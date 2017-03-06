import {Component, OnInit, AfterViewInit} from '@angular/core';
import { CalendarEvent } from 'angular-calendar';

import * as moment from 'moment';

import {WorkPaketService} from "app/work-paket.service";
import {Workpaket} from "app/domain/workpaket";
import {SkillService} from "app/skill.service";
import {Skill} from "app/domain/skill";

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

  events = [];

  constructor(private workPaketService:WorkPaketService, private skillService:SkillService) {
    workPaketService.newWorkPaketsAvailable$.subscribe(
      workPakets => {
        this.createEvents(workPakets);
      });
    if (workPaketService.workPakets) {
      this.createEvents(workPaketService.workPakets);
    }
  }

  createEvents(workPakets:Workpaket[]) {
    this.workPakets = workPakets;
    this.events = [];
    for (let workPaket of workPakets) {
      let endMoment = moment(workPaket.date).add({hours:12});
      let startMoment = endMoment.subtract({hours:1});
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
              title: workPaket.description,
              color: {
                primary: skill.color,
                secondary: skill.color
              }
            };
            this.events.push(evt);
          }
        }
      }
    }
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.workPaketService.fetchWorkPakets().subscribe();
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
