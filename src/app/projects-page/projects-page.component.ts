import {Component, OnInit, AfterViewChecked, AfterViewInit} from '@angular/core';
import {SkillService} from "app/skill.service";

@Component({
  selector: 'app-projects-page',
  templateUrl: './projects-page.component.html',
  styleUrls: ['./projects-page.component.css']
})
export class ProjectsPageComponent implements OnInit, AfterViewInit {

  constructor(private skillService:SkillService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    //this.skillService.fetchSkills().subscribe();
  }
}
