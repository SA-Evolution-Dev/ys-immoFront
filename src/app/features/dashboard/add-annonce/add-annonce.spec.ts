import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAnnonce } from './add-annonce';

describe('AddAnnonce', () => {
  let component: AddAnnonce;
  let fixture: ComponentFixture<AddAnnonce>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAnnonce]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAnnonce);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
