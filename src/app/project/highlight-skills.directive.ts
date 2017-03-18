import {Directive, Input, HostListener} from '@angular/core';
import {SkillService} from "app/skill.service";
import {Subscription} from "rxjs";
import {Project} from "app/domain/project";

@Directive({
  selector: '[appHighlightSkills]'
})
export class HighlightSkillsDirective {

  @Input() project:Project;

  private highlightSubscription:Subscription;

  constructor(private skillService:SkillService) { }

  @HostListener('mouseenter')
  highlightSkills() {
    this.highlightSubscription = this.skillService.fetchSkillIdsByProject(this.project).subscribe();
  }

  @HostListener('mouseleave')
  dehighlightSkills() {
    if (this.highlightSubscription) {
      this.highlightSubscription.unsubscribe();
    }
    this.skillService.dehighlightSkills();
  }
}
