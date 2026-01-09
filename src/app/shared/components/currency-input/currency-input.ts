import { Component, Input, forwardRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-currency-input',
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CurrencyInput),
      multi: true
    }
  ],
  templateUrl: './currency-input.html',
  styleUrl: './currency-input.scss',
})
export class CurrencyInput implements ControlValueAccessor, OnInit {
  @Input() id: string = 'currencyInput';
  @Input() label: string = 'Montant';
  @Input() placeholder: string = 'Entrez un montant';
  @Input() currency: string = 'FCFA';
  @Input() showNumericValue: boolean = false;
  @Input() maxValue?: number;
  @Input() minValue: number = 0;

  displayValue: string = '';
  numericValue: number = 0;
  disabled: boolean = false;
  private isFocused: boolean = false;

  private onChange: (value: number) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnInit() {
    this.id = this.id || `currency-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Formatage avec séparateur de milliers
  private formatNumber(value: number): string {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  // Suppression du formatage
  private unformatNumber(value: string): number {
    const cleaned = value.replace(/\s/g, '').replace(/[^\d]/g, '');
    return cleaned ? parseInt(cleaned, 10) : 0;
  }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const cursorPosition = input.selectionStart || 0;
    const oldLength = this.displayValue.length;

    // Extraire la valeur numérique
    this.numericValue = this.unformatNumber(input.value);

    // Appliquer les limites
    if (this.maxValue !== undefined && this.numericValue > this.maxValue) {
      this.numericValue = this.maxValue;
    }
    if (this.numericValue < this.minValue) {
      this.numericValue = this.minValue;
    }

    // Formater si pas en focus (mode édition)
    if (!this.isFocused) {
      this.displayValue = this.formatNumber(this.numericValue);
    } else {
      this.displayValue = this.numericValue.toString();
    }

    // Restaurer la position du curseur
    const newLength = this.displayValue.length;
    const newCursorPosition = cursorPosition + (newLength - oldLength);
    
    setTimeout(() => {
      input.setSelectionRange(newCursorPosition, newCursorPosition);
    });

    this.onChange(this.numericValue);
  }

  onFocus(): void {
    this.isFocused = true;
    // Afficher le nombre sans formatage en mode édition
    this.displayValue = this.numericValue > 0 ? this.numericValue.toString() : '';
  }

  onBlur(): void {
    this.isFocused = false;
    // Appliquer le formatage au blur
    if (this.numericValue > 0) {
      this.displayValue = this.formatNumber(this.numericValue);
    } else {
      this.displayValue = '';
    }
    this.onTouched();
  }

  // Implémentation ControlValueAccessor
  writeValue(value: number): void {
    this.numericValue = value || 0;
    this.displayValue = value > 0 ? this.formatNumber(value) : '';
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

}
