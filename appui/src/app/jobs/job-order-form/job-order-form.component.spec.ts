import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobOrderFormComponent } from './job-order-form.component';

describe('JobOrderFormComponent', () => {
  let component: JobOrderFormComponent;
  let fixture: ComponentFixture<JobOrderFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobOrderFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobOrderFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
