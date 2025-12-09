import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PFooter } from './p-footer';

describe('PFooter', () => {
  let component: PFooter;
  let fixture: ComponentFixture<PFooter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PFooter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PFooter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
