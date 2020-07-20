import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityDowntimeComponent } from './activity-downtime.component';

describe('ActivityDowntimeComponent', () => {
  let component: ActivityDowntimeComponent;
  let fixture: ComponentFixture<ActivityDowntimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityDowntimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityDowntimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
