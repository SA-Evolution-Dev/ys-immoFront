import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingPageSpinner } from './loading-page-spinner';

describe('LoadingPageSpinner', () => {
  let component: LoadingPageSpinner;
  let fixture: ComponentFixture<LoadingPageSpinner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingPageSpinner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadingPageSpinner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
