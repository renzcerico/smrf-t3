import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentServicesComponent } from './department-services.component';

describe('DepartmentServicesComponent', () => {
  let component: DepartmentServicesComponent;
  let fixture: ComponentFixture<DepartmentServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepartmentServicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
