import {Component, OnInit, Input} from '@angular/core';
import {Skill} from "app/domain/skill";

@Component({
  selector: 'app-associate-skill-input',
  templateUrl: './associate-skill-input.component.html',
  styleUrls: ['./associate-skill-input.component.css']
})
export class AssociateSkillInputComponent implements OnInit {

  public skill:String = "";

  @Input() skills:Skill[];
  @Input() associatedSkill:any;

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
    if (this.associatedSkill) {
      if (this.associatedSkill.skill) {
        this.skill = this.associatedSkill.skill.name;
      }
    }
  }

  skillSelected(name:string) {
    this.associatedSkill.skill = this.getSkillByName(name);
  }

}
