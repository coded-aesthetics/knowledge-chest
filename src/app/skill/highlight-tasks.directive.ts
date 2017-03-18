import {Directive, Input, HostListener} from '@angular/core';
import {Skill} from "app/domain/skill";
import {TaskService} from "app/task.service";
import {Subscription} from "rxjs";

@Directive({
  selector: '[appHighlightTasks]'
})
export class HighlightTasksDirective {
  @Input() skill:Skill;

  private subscription:Subscription;

  constructor(private taskService:TaskService) { }

  @HostListener('mouseenter')
  highlightTasks() {
    this.subscription = this.taskService.fetchTasksBySkill(this.skill).subscribe();
  }

  @HostListener('mouseleave')
  dehighlightTasks() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.taskService.dehighlightTasks();
  }

}
