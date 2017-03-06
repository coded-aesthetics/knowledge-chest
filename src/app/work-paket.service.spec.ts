/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { WorkPaketService } from './work-paket.service';

describe('WorkPaketService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WorkPaketService]
    });
  });

  it('should ...', inject([WorkPaketService], (service: WorkPaketService) => {
    expect(service).toBeTruthy();
  }));
});
