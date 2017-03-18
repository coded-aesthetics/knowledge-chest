import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { CalendarModule } from 'angular-calendar';
import { ModalModule } from 'ng2-bootstrap/modal' ;
import { AccordionModule } from 'ng2-bootstrap/accordion';
import { QuillModule } from 'ngx-quill';

import { OAuthService } from 'angular2-oauth2/oauth-service';
import { ProjectService } from './project.service'
import { SkillService } from './skill.service'
import { LoginService } from './login/login.service';
import { ArticleService } from './article.service';

import { AppComponent } from './app.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectComponent } from './project/project.component';
import { TaskComponent } from './task/task.component';
import { TaskListComponent } from './task-list/task-list.component';
import { SkillListComponent } from './skill-list/skill-list.component';
import { SkillComponent } from './skill/skill.component';
import { CalendarComponent } from './calendar/calendar.component';
import { LoginComponent } from './login/login.component';
import { ProjectsPageComponent } from './projects-page/projects-page.component';
import { SkillHourComponent } from './skill-hour/skill-hour.component';
import { ComposeArticleModalComponent } from './compose-article-modal/compose-article-modal.component';

import { TaskService } from "app/task.service";
import { WorkPaketService } from "app/work-paket.service";
import { AlertModule } from 'ng2-bootstrap';
import { LogTimeModalComponent } from './log-time-modal/log-time-modal.component';
import { DatepickerModule } from 'ng2-bootstrap/datepicker';
import { TypeaheadModule } from 'ng2-bootstrap/typeahead';
import { AssociateSkillInputComponent } from './associate-skill-input/associate-skill-input.component';
import { ArticleListComponent } from './article-list/article-list.component';
import { ArticleComponent } from './article/article.component';
import { ProjectDetailPageComponent } from './project-detail-page/project-detail-page.component';
import { ProjectInfoComponent } from './project-info/project-info.component';
import { SafeStylePipe } from './safe-style.pipe';
import { SkillDetailPageComponent } from './skill-detail-page/skill-detail-page.component';
import { SkillInfoComponent } from './skill-info/skill-info.component';
import { HighlightTasksDirective } from './skill/highlight-tasks.directive';
import { HighlightSkillsDirective } from './project/highlight-skills.directive';

const appRoutes: Routes = [
  { path: 'login',    component: LoginComponent },
  { path: 'projects', component: ProjectsPageComponent },
  { path: 'projects/detail/:id', component: ProjectDetailPageComponent },
  { path: 'skills/detail/:id', component: SkillDetailPageComponent },
  { path: '',         redirectTo: '/projects', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    ProjectListComponent,
    ProjectComponent,
    TaskComponent,
    TaskListComponent,
    SkillListComponent,
    SkillComponent,
    CalendarComponent,
    LoginComponent,
    ProjectsPageComponent,
    LogTimeModalComponent,
    SkillHourComponent,
    ComposeArticleModalComponent,
    AssociateSkillInputComponent,
    ArticleListComponent,
    ArticleComponent,
    ProjectDetailPageComponent,
    ProjectInfoComponent,
    SafeStylePipe,
    SkillDetailPageComponent,
    SkillInfoComponent,
    HighlightTasksDirective,
    HighlightSkillsDirective
  ],
  imports: [
    CalendarModule.forRoot(),
    TypeaheadModule.forRoot(),
    DatepickerModule.forRoot(),
    ModalModule.forRoot(),
    AccordionModule.forRoot(),
    AlertModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    QuillModule,
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [
    ArticleService,
    SkillService,
    LoginService,
    OAuthService,
    ProjectService,
    TaskService,
    WorkPaketService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
