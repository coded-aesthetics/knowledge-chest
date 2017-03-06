import {Hal} from "app/domain/hal";
import {Skill} from "app/domain/skill";

export class Article extends Hal {
  constructor(a) {
    if (a._embedded) {
      if (a._embedded.skills) {
        a._embedded.skills = a._embedded.skills.map((s) => { return (s instanceof Skill) ? s : new Skill(s); });
      }
    }
    super(a);
    this.id = a.id;
    this.headline = a.headline;
    this.text = a.text;
    this.date = a.date;
  }
  public id:number;
  public headline:string;
  public text:string;
  public date:Date;
}
