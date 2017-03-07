import {
  Component, OnInit, OnDestroy, ViewContainerRef, ViewChild, AfterViewInit, Output,
  EventEmitter, Input
} from '@angular/core';
import * as moment from 'moment';
import { SkillService } from "app/skill.service";
import { Skill } from "app/domain/skill";
import {Subscription} from "rxjs";
import {ModalDirective} from "ng2-bootstrap";
import {SkillHour} from "app/domain/skill-hour";
import {Workpaket} from "app/domain/workpaket";


@Component({
  selector: 'app-log-time-modal',
  templateUrl: './log-time-modal.component.html',
  styleUrls: ['./log-time-modal.component.css']
})
export class LogTimeModalComponent implements OnInit, AfterViewInit {

  @ViewChild('lgModal') lgModal:ModalDirective;
  @Output() onShow = new EventEmitter<any>();
  @Output() onHide = new EventEmitter<any>();
  @Output() modalSubmit = new EventEmitter<Workpaket>();

  @Input() skills:Skill[];

  public showModal:boolean = true;

  private workPaket:Workpaket = new Workpaket({date:new Date(),_embedded:{skillHours:[new SkillHour({})]}});

  private description:string = "";
  private startDate:Date = new Date();
  private endDate:Date = new Date();

  private skill:Skill = new Skill({});

  constructor() {
  }

  onHidden() {
    console.log("onHidden");
    this.onHide.emit("hidden");
  }

  ngAfterViewInit() {
    this.lgModal.show();
    this.onShow.emit("shown");
  }

  ngOnInit() {

    /*this.skillService.fetchSkills().subscribe(
      (hal) => {this.skills = hal.getEmbedded("skills")},
      () => {}
    );*/
  }

  addSkillHour() {
    this.workPaket._embedded.skillHours.push(new SkillHour({}));
  }

  onKeyUp(value) {
    console.log(value);
  }

  onSubmit(event) {
    event.preventDefault();
    console.log(this.endDate);
    console.log(this.workPaket);
    this.modalSubmit.emit(this.workPaket);
    this.lgModal.hide();
  }

}
