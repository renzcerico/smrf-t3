import { TestBed } from '@angular/core/testing';

import { ServiceWebSocketService } from './service-web-socket.service';

describe('ServiceWebSocketService', () => {
  let service: ServiceWebSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceWebSocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
