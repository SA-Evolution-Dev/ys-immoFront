import { Component, Input, Output, EventEmitter, forwardRef, signal, computed, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor, NgControl } from '@angular/forms';

export interface SelectOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-search-select',
  imports: [CommonModule, FormsModule],
  templateUrl: './search-select.html',
  styleUrl: './search-select.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchSelect),
      multi: true
    }
  ]
})
export class SearchSelect implements ControlValueAccessor {
  @Input() id: string = '';
  @Input() label: string = '';
  @Input() placeholder: string = '-- Sélectionnez --';
  @Input() options: SelectOption[] = [];
  @Input() required: boolean = false;
  
  @Output() valueChange = new EventEmitter<string>();

  // Signals Angular 19
  isOpen = signal(false);
  searchTerm = signal('');
  selectedValue = signal('');

  // Computed - Options filtrées
  filteredOptions = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) {
      return this.options;
    }
    return this.options.filter(option => 
      option.label.toLowerCase().includes(term)
    );
  });

  // Computed - Label de l'option sélectionnée
  selectedLabel = computed(() => {
    const value = this.selectedValue();
    if (!value) return '';
    const option = this.options.find(opt => opt.value === value);
    return option ? option.label : '';
  });

  constructor(private elementRef: ElementRef) {}

  // HostListener pour détecter les clics en dehors
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    
    if (!clickedInside && this.isOpen()) {
      this.closeDropdown();
    }
  }

  // HostListener pour les appareils tactiles
  @HostListener('document:touchstart', ['$event'])
  onDocumentTouch(event: TouchEvent): void {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    
    if (!clickedInside && this.isOpen()) {
      this.closeDropdown();
    }
  }

  // ControlValueAccessor
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.selectedValue.set(value || '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Gérer l'état désactivé si nécessaire
  }

  // Méthodes
  toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.isOpen.update(open => !open);
    if (!this.isOpen()) {
      this.searchTerm.set('');
      this.onTouched();
    }
  }

  closeDropdown(): void {
    if (this.isOpen()) {
      this.isOpen.set(false);
      this.searchTerm.set('');
      this.onTouched();
    }
  }

  selectOption(option: SelectOption, event: Event): void {
    event.stopPropagation();
    this.selectedValue.set(option.value);
    this.onChange(option.value);
    this.valueChange.emit(option.value);
    this.closeDropdown();
  }

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  preventClose(event: Event): void {
    event.stopPropagation();
  }

}
