import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestClosedComponent } from './request-closed.component';

describe('RequestClosedComponent', () => {
  let component: RequestClosedComponent;
  let fixture: ComponentFixture<RequestClosedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestClosedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestClosedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
