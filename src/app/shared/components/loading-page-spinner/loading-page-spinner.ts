import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-page-spinner',
  imports: [CommonModule],
  templateUrl: './loading-page-spinner.html',
  styleUrl: './loading-page-spinner.scss',
})
export class LoadingPageSpinner {

  @Input() show = false;
  @Input() centered = true;
  @Input() fadeIn = true;
  @Input() overlay = false;
  @Input() fullPage = false; // ✅ NOUVEAU : Active le mode pleine page
  @Input() customClass = '';
  @Input() color = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() title = '';
  @Input() message = '';
  @Input() loadingText = 'Chargement...';
  @Input() overlayOpacity = 0.5; // ✅ NOUVEAU : Opacité du fond (0 à 1)

  getSpinnerSize(): string {
    const sizes = {
      sm: '2rem',
      md: '3rem',
      lg: '4rem'
    };
    return sizes[this.size] || sizes.md;
  }

}
