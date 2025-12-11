import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsAnnonce } from './details-annonce';

describe('DetailsAnnonce', () => {
  let component: DetailsAnnonce;
  let fixture: ComponentFixture<DetailsAnnonce>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsAnnonce]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsAnnonce);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
