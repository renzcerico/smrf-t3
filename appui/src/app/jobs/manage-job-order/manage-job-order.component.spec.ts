import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageJobOrderComponent } from './manage-job-order.component';

describe('ManageJobOrderComponent', () => {
  let component: ManageJobOrderComponent;
  let fixture: ComponentFixture<ManageJobOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageJobOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageJobOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
