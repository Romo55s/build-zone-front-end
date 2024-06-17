import { TestBed } from '@angular/core/testing';

import { TostifyService } from './tostify.service';

describe('TostifyService', () => {
  let service: TostifyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TostifyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
