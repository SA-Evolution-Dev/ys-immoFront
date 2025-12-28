import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl';
export type SpinnerColor = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading-spinner.html',
  styleUrls: ['./loading-spinner.scss']
})
export class LoadingSpinnerComponent {
  /**
   * Titre principal affiché sous le spinner
   */
  @Input() title: string = 'Chargement...';

  /**
   * Message descriptif affiché sous le titre
   */
  @Input() message: string = '';

  /**
   * Taille du spinner
   * - sm: 2rem
   * - md: 3rem
   * - lg: 4rem
   * - xl: 5rem
   */
  @Input() size: SpinnerSize = 'lg';

  /**
   * Couleur du spinner (Bootstrap colors)
   */
  @Input() color: SpinnerColor = 'primary';

  /**
   * Afficher ou masquer le composant
   */
  @Input() show: boolean = true;

  /**
   * Texte pour le screen reader
   */
  @Input() loadingText: string = 'Chargement en cours...';

  /**
   * Centrer verticalement le contenu (utilise mb-6 par défaut)
   */
  @Input() centered: boolean = true;

  /**
   * Animation de fade-in
   */
  @Input() fadeIn: boolean = true;

  /**
   * Afficher un overlay en arrière-plan
   */
  @Input() overlay: boolean = false;

  /**
   * Classe CSS personnalisée supplémentaire
   */
  @Input() customClass: string = '';

  /**
   * Obtenir la taille du spinner en pixels
   */
  getSpinnerSize(): string {
    const sizes = {
      sm: '2rem',
      md: '3rem',
      lg: '4rem',
      xl: '5rem'
    };
    return sizes[this.size];
  }
}
