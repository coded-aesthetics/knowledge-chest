import { Component, OnInit } from '@angular/core';
import {ProjectService} from "app/project.service";
import {ActivatedRoute} from "@angular/router";
import {Project} from "app/domain/project";
import {ArticleService} from "app/article.service";
import {Article} from "app/domain/article";

@Component({
  selector: 'app-project-detail-page',
  templateUrl: './project-detail-page.component.html',
  styleUrls: ['./project-detail-page.component.css']
})
export class ProjectDetailPageComponent implements OnInit {

  private id:number;

  constructor(private projectService:ProjectService, private route: ActivatedRoute, private articleService:ArticleService) { }

  ngOnInit() {
    this.id = +this.route.snapshot.params['id'];
  }

}
