import {Hal} from "app/domain/hal";
import {SkillHour} from "app/domain/skill-hour";
export class Workpaket extends Hal {

  public description:string;

  public date:Date;

  //public _embedded = {skillHours:[]};

  constructor(w) {
    if (w._embedded) {
      if (w._embedded.skillHours) {
        w._embedded.skillHours = w._embedded.skillHours.map((sh) => { return (sh instanceof SkillHour) ? sh : new SkillHour(sh); });
      }
    }
    super(w);
    if (w.date) {
      this.date = w.date;
    }
    if (w.description) {
      this.description = w.description;
    }
  }
}
