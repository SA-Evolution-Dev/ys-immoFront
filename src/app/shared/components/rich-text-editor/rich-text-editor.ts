// rich-text-editor.component.ts
import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';

@Component({
  selector: 'app-rich-text-editor',
  standalone: true,
  imports: [EditorModule, FormsModule],
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RichTextEditor),
      multi: true
    }
  ],
  templateUrl: './rich-text-editor.html',
  styleUrl: './rich-text-editor.scss',
})
export class RichTextEditor implements ControlValueAccessor {
  // ✅ Propriétés d'entrée
  @Input() height: number = 500;
  @Input() placeholder: string = 'Écrivez votre contenu ici...';
  @Input() toolbar: string = 'undo redo | bold italic | alignleft aligncenter | bullist numlist';
  @Input() plugins: string[] = ['lists', 'link', 'image', 'table', 'code'];
  @Input() disabled: boolean = false;
  
  // ✅ Événements de sortie
  @Output() contentChange = new EventEmitter<string>();
  @Output() editorInit = new EventEmitter<any>();
  
  content = '';
  
  // ✅ Pour ControlValueAccessor
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  // ✅ Configuration dynamique de l'éditeur
  get editorConfig() {
    return {
      height: this.height,
      menubar: false,
      statusbar: false,
      branding: false,
      resize: true,
      placeholder: this.placeholder,
      disabled: this.disabled,
      plugins: this.plugins,
      toolbar: this.toolbar,
      
      // ✅ Callback lors de l'initialisation
      setup: (editor: any) => {
        editor.on('init', () => {
          this.editorInit.emit(editor);
        });
      }
    };
  }

  // ✅ Méthode appelée quand le contenu change
  onContentChange(newContent: string) {
    this.content = newContent;
    this.onChange(newContent);
    this.contentChange.emit(newContent);
  }

  // ✅ Implémentation ControlValueAccessor
  writeValue(value: string): void {
    this.content = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}