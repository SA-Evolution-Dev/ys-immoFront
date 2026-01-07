import { Directive, ElementRef, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import flatpickr from 'flatpickr';
import { Instance } from 'flatpickr/dist/types/instance';
import { French } from 'flatpickr/dist/l10n/fr';

@Directive({
  selector: '[appFlatpickr]'
})
export class Flatpickr {

  @Input() config: any = {};
  @Output() dateChange = new EventEmitter<Date | Date[]>();
  
  private flatpickrInstance?: Instance;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.flatpickrInstance = flatpickr(this.el.nativeElement, {
      locale: French,
      dateFormat: 'd/m/Y',
      altInput: true,
      altFormat: 'd/m/Y',
      ...this.config,
      onChange: (selectedDates) => {
        this.dateChange.emit(selectedDates.length === 1 ? selectedDates[0] : selectedDates);
      }
    });
  }

  ngOnDestroy() {
    if (this.flatpickrInstance) {
      this.flatpickrInstance.destroy();
    }
  }

}
