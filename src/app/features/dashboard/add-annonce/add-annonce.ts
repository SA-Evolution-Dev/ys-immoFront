import { Component, signal } from '@angular/core';
import { RichTextEditor } from '../../../shared/components/rich-text-editor/rich-text-editor';
import { Flatpickr } from '../../../shared/directives/flatpickr';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-add-annonce',
  imports: [RichTextEditor, Flatpickr, DatePipe],
  templateUrl: './add-annonce.html',
  styleUrl: './add-annonce.scss',
})
export class AddAnnonce {
  content = signal('<p>Contenu initial</p>');
  advancedContent = signal('');
  isDisabled = signal(false);
  errorMessage = signal('');

  selectedDate?: Date;
  dateConfig = {
    dateFormat: 'd/m/Y',
    altInput: true,
    altFormat: 'd/m/Y'
  };
  dateTimeConfig = {
    enableTime: true,
    dateFormat: 'd/m/Y H:i',
    altFormat: 'd/m/Y H:i',
    time_24hr: true
  };
  rangeConfig = {
    mode: 'range',
    dateFormat: 'd/m/Y',
    altFormat: 'd/m/Y'
  };

  onContentChange(data: string) {
    this.content.set(data);
  }

  onAdvancedChange(data: string) {
    this.advancedContent.set(data);
  }

  onEditorReady(editor: any) {
    // console.log('Éditeur prêt!', editor);
  }

  toggleDisabled() {
    this.isDisabled.update(v => !v);
  }


  onDateChange(date: Date | Date[]) {
    if (!Array.isArray(date)) {
      this.selectedDate = date;
    }
    console.log('Date:', date);
  }

  onDateTimeChange(date: Date | Date[]) {
    console.log('DateTime:', date);
  }

  onRangeChange(dates: Date | Date[]) {
    console.log('Range:', dates);
  }
}
