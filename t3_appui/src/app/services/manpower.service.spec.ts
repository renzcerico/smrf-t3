import { TestBed } from '@angular/core/testing';

import { ManpowerService } from './manpower.service';

describe('ManpowerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ManpowerService = TestBed.get(ManpowerService);
    expect(service).toBeTruthy();
  });
});
