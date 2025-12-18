import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingAnnonces } from './listing-annonces';

describe('ListingAnnonces', () => {
  let component: ListingAnnonces;
  let fixture: ComponentFixture<ListingAnnonces>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListingAnnonces]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListingAnnonces);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
