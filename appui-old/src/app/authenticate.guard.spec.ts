import { TestBed, async, inject } from '@angular/core/testing';

import { AuthenticateGuard } from './authenticate.guard';

describe('AuthenticateGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthenticateGuard]
    });
  });

  it('should ...', inject([AuthenticateGuard], (guard: AuthenticateGuard) => {
    expect(guard).toBeTruthy();
  }));
});
