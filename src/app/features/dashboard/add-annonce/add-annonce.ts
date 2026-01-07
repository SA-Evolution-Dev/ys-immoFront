import { Component, signal } from '@angular/core';
import { RichTextEditor } from '../../../shared/components/rich-text-editor/rich-text-editor';


@Component({
  selector: 'app-add-annonce',
  imports: [RichTextEditor],
  templateUrl: './add-annonce.html',
  styleUrl: './add-annonce.scss',
})
export class AddAnnonce {
  content = signal('<p>Contenu initial</p>');
  advancedContent = signal('');
  isDisabled = signal(false);
  errorMessage = signal('');

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
}
