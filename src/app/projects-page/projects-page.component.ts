import {Component, OnInit, AfterViewChecked, AfterViewInit} from '@angular/core';
import {SkillService} from "app/skill.service";
import {ProjectService} from "app/project.service";
import {Project} from "app/domain/project";

@Component({
  selector: 'app-projects-page',
  templateUrl: './projects-page.component.html',
  styleUrls: ['./projects-page.component.css']
})
export class ProjectsPageComponent implements OnInit, AfterViewInit {

  private projects:Project[] = [];

  constructor(private skillService:SkillService, private projectService:ProjectService) { }

  ngOnInit() {
    this.fetchProjects();
  }

  fetchProjects():void {
    this.projectService.getProjects().subscribe((projectsHal) => {
      this.projects = projectsHal.getEmbedded("projects");
      this.skillService.fetchSkills().subscribe();
    });
  }

  ngAfterViewInit() {
    //this.skillService.fetchSkills().subscribe();
  }
}
