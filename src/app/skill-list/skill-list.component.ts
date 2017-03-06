import {Component, OnInit, OnDestroy} from '@angular/core';

import { Skill } from '../domain/skill';

import { SkillService } from '../skill.service';
import { Hal } from "app/domain/hal";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-skill-list',
  templateUrl: './skill-list.component.html',
  styleUrls: ['./skill-list.component.css']
})
export class SkillListComponent implements OnInit,OnDestroy {

  public newSkillName:string;
  public skills: Skill[];
  public hal:Hal;

  subscription:Subscription;

  constructor(private skillService:SkillService) {
    this.subscription = skillService.newSkillsAvailable$.subscribe(
      skills => {
        this.skills = skills;
      });
  }

  ngOnInit() {
    this.fetchSkills();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


  fetchSkills():void {
  }

  addSkill():void {
    this.skillService.addSkill({name:this.newSkillName}).subscribe();
  }

  deleteSkill(skill:Skill) {
    this.skillService.deleteSkill(skill).subscribe();
  }
}
