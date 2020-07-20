import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestAcceptanceComponent } from './request-acceptance.component';

describe('RequestAcceptanceComponent', () => {
  let component: RequestAcceptanceComponent;
  let fixture: ComponentFixture<RequestAcceptanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestAcceptanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestAcceptanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
