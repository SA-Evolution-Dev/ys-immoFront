import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PHeader } from './p-header';

describe('PHeader', () => {
  let component: PHeader;
  let fixture: ComponentFixture<PHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
