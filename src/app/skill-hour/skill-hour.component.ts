import {Component, OnInit, Input} from '@angular/core';
import {Skill} from "app/domain/skill";
import {SkillHour} from "app/domain/skill-hour";

@Component({
  selector: 'app-skill-hour',
  templateUrl: './skill-hour.component.html',
  styleUrls: ['./skill-hour.component.css']
})
export class SkillHourComponent implements OnInit {

  public skill:String = "";
  public hours:number = 0;

  @Input() skills:Skill[];
  @Input() skillHour:SkillHour;

  getSkillByName(name:string):Skill {
    for (let i = 0; i < this.skills.length; i++) {
      if (this.skills[i].name == name) {
        return this.skills[i];
      }
    }
    return null;
  }

  constructor() { }

  ngOnInit() {
  }

  skillSelected(name:string) {
    this.skillHour.skill = this.getSkillByName(name);
  }

}
