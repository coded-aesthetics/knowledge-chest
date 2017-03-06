import { Task } from './task';
import { Hal } from "app/domain/hal";

export class Project extends Hal {
  constructor(p) {
    if (p._embedded) {
      if (p._embedded.tasks) {
        p._embedded.tasks = p._embedded.tasks.map((t) => { return (t instanceof Task) ? t : new Task(t); });
      }
    }
    super(p);
    this.id = p.id;
    this.name = p.name;
  }
  public id:number;
  public name:string;
}
