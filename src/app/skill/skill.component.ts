import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

import { Skill } from '../domain/skill';
import {TaskService} from "app/task.service";
import {Subscription} from "rxjs";
import {SkillService} from "app/skill.service";
import {ArticleService} from "app/article.service";
import {Article} from "app/domain/article";

@Component({
  selector: 'app-skill',
  templateUrl: './skill.component.html',
  styleUrls: ['./skill.component.css']
})
export class SkillComponent implements OnInit {

  @Input() skill:Skill;
  @Output() onDelete = new EventEmitter<Skill>();

  skills:Skill[];

  highlight:boolean = false;
  showModal:boolean = false;

  constructor(private taskService:TaskService, private skillService:SkillService) {
    skillService.newHighlightSkillsAvailable$.subscribe(
      (hSkills) => {
        this.highlight = false;
        for (let skillId of hSkills) {
          if (skillId == this.skill.id) {
            this.highlight = true;
          }
        }
      },
      () => {}
    );
    this.subscription = skillService.newSkillsAvailable$.subscribe(
      skills => {
        this.skills = skills;
        console.log(skills);
      });
    if (skillService.skills) {
      this.skills = skillService.skills;
    }
  }

  ngOnInit() {
  }

  deleteSkill() {
    this.onDelete.emit(this.skill);
  }

  private subscription:Subscription;

  highlightTasks() {
    this.subscription = this.taskService.fetchTasksBySkill(this.skill).subscribe();
  }

  dehighlightTasks() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.taskService.dehighlightTasks();
  }


}
