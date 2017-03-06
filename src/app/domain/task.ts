import { Hal } from "app/domain/hal";
export class Task extends Hal {
  constructor(task) {
    super(task);

    if (task.id) {
      this.id = task.id;
    }

    if (task.name) {
      this.name = task.name;
    }

    if (task.done) {
      this.done = task.done;
    }
  }
  public id:number;
  public name:string = "";
  public done:boolean = false;
}
