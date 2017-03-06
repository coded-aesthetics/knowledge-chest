import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../project.service';
import { Project } from '../domain/project';
import {Hal} from "app/domain/hal";
import {SkillService} from "app/skill.service";

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {

  public projects:Project[];
  public hal:Hal;
  public addProjectName:string;

  constructor(private projectService:ProjectService, private skillService:SkillService) {}

  getProjects():void {
    this.projectService.getProjects().subscribe((projects) => {
      this.hal = projects;
      this.projects = this.hal.getEmbedded("projects");
      console.log(this.projects);
      this.skillService.fetchSkills().subscribe();
    });
  }

  addProject():void {
    this.projectService.addProject({name:this.addProjectName}).subscribe(
      () => {console.log("went");this.getProjects()},
      () => {console.log("died");}
    );
  }

  taskAdded(task:any) {
    this.getProjects();
  }

  taskDeleted(task:any) {
    this.getProjects();
  }

  projectDeleted(project:Project) {
    this.getProjects();
  }

  ngOnInit(): void {
    this.getProjects();
  }

}
