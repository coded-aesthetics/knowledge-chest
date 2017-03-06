import {Hal} from "app/domain/hal";
import {Skill} from "app/domain/skill";
export class SkillHour extends Hal {

  public hours:number = 0;
  public skill:Skill = null;

  constructor(sh) {
    super(sh);
    if (sh.hours) {
      this.hours = sh.hours;
    }
    if (sh.skill) {
      this.skill = sh.skill;
    }
  }

}
