import { Hal } from "app/domain/hal";

export class Skill extends Hal {

  public id:number;
  public name:string;
  public color:string;

  constructor(s) {
    super(s);
    this.id = s.id;
    this.name = s.name;
    if (s.color) {
      this.color = s.color;
    }
  }

}
