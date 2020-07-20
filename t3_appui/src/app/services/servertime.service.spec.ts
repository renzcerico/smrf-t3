import { TestBed } from '@angular/core/testing';

import { ServertimeService } from './servertime.service';

describe('ServertimeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServertimeService = TestBed.get(ServertimeService);
    expect(service).toBeTruthy();
  });
});
