/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SkillHourComponent } from './skill-hour.component';

describe('SkillHourComponent', () => {
  let component: SkillHourComponent;
  let fixture: ComponentFixture<SkillHourComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkillHourComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillHourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
