import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobOrderSummaryComponent } from './job-order-summary.component';

describe('JobOrderSummaryComponent', () => {
  let component: JobOrderSummaryComponent;
  let fixture: ComponentFixture<JobOrderSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobOrderSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobOrderSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
