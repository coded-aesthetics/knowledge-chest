import { Component, OnInit } from '@angular/core';
import {ProjectService} from "app/project.service";
import {SkillService} from "app/skill.service";
import {ActivatedRoute} from "@angular/router";
import {Project} from "app/domain/project";

@Component({
  selector: 'app-skill-detail-page',
  templateUrl: './skill-detail-page.component.html',
  styleUrls: ['./skill-detail-page.component.css']
})
export class SkillDetailPageComponent implements OnInit {

  private id:number;
  private projects:Project[];

  constructor(private projectService:ProjectService, private route: ActivatedRoute, private skillService:SkillService) { }

  ngOnInit() {
    this.id = +this.route.snapshot.params['id'];
    this.projectService.fetchProjectsBySkillId(this.id).subscribe(
      (projectsHal) => {
        this.projects = projectsHal.getEmbedded("projects");
      }
    );

  }

}
