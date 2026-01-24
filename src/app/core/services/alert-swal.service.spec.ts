import { TestBed } from '@angular/core/testing';

import { AlertSwalService } from './alert-swal.service';

describe('AlertSwalService', () => {
  let service: AlertSwalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlertSwalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
