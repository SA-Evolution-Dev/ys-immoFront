import { Component, Input, Output, EventEmitter, forwardRef, signal, computed, HostListener, ElementRef, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

/**
 * Interface définissant la structure d'une option du select
 * @property value - Valeur technique de l'option (ex: "abidjan-001")
 * @property label - Libellé affiché à l'utilisateur (ex: "Abidjan")
 */
export interface SelectOption {
  value: string;
  label: string;
}

/**
 * Composant Select avec recherche intégrée
 * 
 * OBJECTIF :
 * Créer un select personnalisé avec :
 * - Barre de recherche pour filtrer les options
 * - Compatible avec les formulaires réactifs Angular (ControlValueAccessor)
 * - Gestion de la validation (is-invalid, is-valid)
 * - Support mobile et desktop
 * 
 * UTILISATION :
 * <app-search-select 
 *   formControlName="ville"
 *   [options]="listeVilles"
 *   label="Ville"
 *   [required]="true"
 * />
 * 
 * @author Votre Nom
 * @version 1.0.0
 */
@Component({
  selector: 'app-search-select',
  imports: [CommonModule, FormsModule],
  templateUrl: './search-select.html',
  styleUrl: './search-select.scss',
  providers: [
    {
      // Permet au composant d'être utilisé avec formControlName
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchSelect),
      multi: true
    }
  ]
})
export class SearchSelect implements ControlValueAccessor {
  
  // ========================================
  // 🎛️ PROPRIÉTÉS D'ENTRÉE (INPUTS)
  // ========================================
  
  /** Identifiant unique du champ (pour l'accessibilité) */
  @Input() id: string = '';
  
  /** Label affiché au-dessus du select */
  @Input() label: string = '';
  
  /** Texte affiché quand aucune option n'est sélectionnée */
  @Input() placeholder: string = '-- Sélectionnez --';
  
  /** Indique si le champ est obligatoire (pour l'UI, validation gérée par FormControl) */
  @Input() required: boolean = false;
  
  /** Désactive le composant (empêche toute interaction) */
  @Input() disabled: boolean = false;
  
  /** Message d'erreur personnalisé (non utilisé actuellement, pour évolution future) */
  @Input() errorMessage: string = '';

  /**
   * Signal contenant les options du select
   * POURQUOI UN SIGNAL ?
   * - Permet la réactivité automatique d'Angular 19+
   * - Déclenche le recalcul des computed() automatiquement
   * - Évite les bugs de non-mise à jour de la liste
   */
  optionsSignal = signal<SelectOption[]>([]);
  
  /**
   * Setter/Getter pour les options
   * OBJECTIF :
   * - Intercepter les changements d'options depuis le composant parent
   * - Mettre à jour le signal pour déclencher la réactivité
   * - Valider que la sélection actuelle existe toujours dans les nouvelles options
   * 
   * POURQUOI ?
   * Si vous changez de ville, les communes doivent se mettre à jour.
   * Si la commune sélectionnée n'existe plus, on la reset automatiquement.
   */
  @Input() 
  set options(value: SelectOption[]) {
    this.optionsSignal.set(value); // ✅ Mise à jour réactive
    this.validateCurrentSelection(); // ✅ Vérification de cohérence
  }
  get options(): SelectOption[] {
    return this.optionsSignal();
  }

  // ========================================
  // 📤 PROPRIÉTÉS DE SORTIE (OUTPUTS)
  // ========================================
  
  /**
   * Événement émis quand la valeur change
   * UTILISATION :
   * <app-search-select (valueChange)="onVilleChanged($event)" />
   */
  @Output() valueChange = new EventEmitter<string>();

  // ========================================
  // 🔄 SIGNALS (État réactif Angular 19+)
  // ========================================
  
  /** Indique si le dropdown est ouvert ou fermé */
  isOpen = signal(false);
  
  /** Terme de recherche saisi par l'utilisateur dans le champ de filtrage */
  searchTerm = signal('');
  
  /** Valeur actuellement sélectionnée (value de l'option) */
  selectedValue = signal('');
  
  /** Indique si l'utilisateur a interagi avec le champ (pour la validation) */
  isTouched = signal(false);

  // ========================================
  // 🧮 COMPUTED (Valeurs calculées automatiquement)
  // ========================================
  
  /**
   * Liste des options filtrées selon la recherche
   * OBJECTIF :
   * - Si searchTerm vide → afficher toutes les options
   * - Si searchTerm rempli → filtrer les options dont le label contient le terme
   * 
   * POURQUOI COMPUTED ?
   * - Se recalcule automatiquement quand searchTerm ou optionsSignal changent
   * - Optimisé par Angular (pas de recalcul inutile)
   * - Plus performant qu'une fonction appelée dans le template
   */
  filteredOptions = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const opts = this.optionsSignal();
    
    // Pas de filtre si pas de recherche
    if (!term) {
      return opts;
    }
    
    // Filtrage case-insensitive
    return opts.filter(option => 
      option.label.toLowerCase().includes(term)
    );
  });

  /**
   * Label de l'option actuellement sélectionnée
   * OBJECTIF :
   * - Afficher le texte lisible (label) au lieu de la valeur technique (value)
   * - Retourner chaîne vide si rien n'est sélectionné
   * 
   * EXEMPLE :
   * Si selectedValue = "abidjan-001" → Retourne "Abidjan"
   */
  selectedLabel = computed(() => {
    const value = this.selectedValue();
    if (!value) return '';
    
    const opts = this.optionsSignal();
    const option = opts.find(opt => opt.value === value);
    return option ? option.label : '';
  });

  // ========================================
  // 🎨 HOST BINDINGS (Classes CSS du composant)
  // ========================================
  
  /**
   * Applique la classe 'is-invalid' au composant hôte
   * OBJECTIF :
   * - Récupérer la classe appliquée par le composant parent
   * - Permet d'afficher le style d'erreur (bordure rouge)
   * 
   * UTILISATION :
   * <app-search-select [class.is-invalid]="formControl.invalid && formControl.touched" />
   */
  @HostBinding('class.is-invalid')
  get isInvalidClass(): boolean {
    return this.elementRef.nativeElement.classList.contains('is-invalid');
  }

  /**
   * Applique la classe 'is-valid' au composant hôte
   * OBJECTIF : Afficher le style de succès (bordure verte)
   */
  @HostBinding('class.is-valid')
  get isValidClass(): boolean {
    return this.elementRef.nativeElement.classList.contains('is-valid');
  }

  // ========================================
  // 🏗️ CONSTRUCTOR
  // ========================================
  
  /**
   * @param elementRef - Référence au composant DOM
   * POURQUOI ? Permet de détecter les clics en dehors du composant
   */
  constructor(private elementRef: ElementRef) {}

  // ========================================
  // 🎧 HOST LISTENERS (Écoute des événements globaux)
  // ========================================
  
  /**
   * Détecte les clics n'importe où dans le document
   * OBJECTIF : Fermer le dropdown si l'utilisateur clique en dehors
   * POURQUOI ? Améliore l'UX (comportement standard des dropdowns)
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    
    if (!clickedInside && this.isOpen()) {
      this.closeDropdown();
    }
  }

  /**
   * Détecte les touchers sur mobile (touchstart)
   * OBJECTIF : Même comportement que le clic, mais pour les appareils tactiles
   * POURQUOI ? Les appareils mobiles ne déclenchent pas toujours 'click'
   */
  @HostListener('document:touchstart', ['$event'])
  onDocumentTouch(event: TouchEvent): void {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);

    if (!clickedInside && this.isOpen()) {
      this.closeDropdown();
    }
  }

  /**
   * Détecte la touche Échap du clavier
   * OBJECTIF : Fermer le dropdown avec Échap (accessibilité)
   * POURQUOI ? Comportement standard des modales/dropdowns
   */
  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.isOpen()) {
      this.closeDropdown();
    }
  }

  // ========================================
  // 🔌 CONTROL VALUE ACCESSOR
  // (Permet l'intégration avec FormControl)
  // ========================================
  
  /**
   * Callback appelée quand la valeur change
   * POURQUOI PRIVATE ?
   * - Utilisée uniquement par Angular
   * - Enregistrée via registerOnChange()
   */
  private onChange: (value: string) => void = () => {};
  
  /**
   * Callback appelée quand le champ est touché (perd le focus)
   * OBJECTIF : Déclencher la validation Angular
   */
  private onTouched: () => void = () => {};

  /**
   * Méthode appelée par Angular pour définir la valeur du champ
   * OBJECTIF : Synchroniser le FormControl → Composant
   * QUAND ? Quand vous faites : formControl.setValue('abidjan')
   */
  writeValue(value: string): void {
    this.selectedValue.set(value || '');
  }

  /**
   * Enregistre la fonction de callback pour les changements
   * OBJECTIF : Synchroniser Composant → FormControl
   * QUAND ? À l'initialisation du composant
   */
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  /**
   * Enregistre la fonction de callback pour le touch
   * OBJECTIF : Gérer le statut "touched" du FormControl
   */
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /**
   * Appelée par Angular pour activer/désactiver le champ
   * OBJECTIF : Gérer l'état disabled du FormControl
   * QUAND ? Quand vous faites : formControl.disable()
   */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // ========================================
  // 🎬 MÉTHODES PUBLIQUES (Actions utilisateur)
  // ========================================
  
  /**
   * Ouvre ou ferme le dropdown au clic sur le bouton
   * OBJECTIF :
   * - Inverser l'état ouvert/fermé
   * - Réinitialiser la recherche à la fermeture
   * - Marquer le champ comme "touché"
   * 
   * @param event - Événement du clic (pour stopPropagation)
   * POURQUOI stopPropagation ? Évite que le clic ne se propage au document
   */
  toggleDropdown(event: Event): void {
    if (this.disabled) return; // Ne rien faire si désactivé

    event.stopPropagation();
    this.isOpen.update(open => !open); // Inverse l'état

    // Si on vient de fermer, nettoyer la recherche
    if (!this.isOpen()) {
      this.searchTerm.set('');
      this.markAsTouched();
    }
  }

  /**
   * Ferme le dropdown et réinitialise la recherche
   * OBJECTIF : Centraliser la logique de fermeture
   * POURQUOI ? Appelé depuis plusieurs endroits (clic dehors, sélection, Échap)
   */
  closeDropdown(): void {
    if (this.isOpen()) {
      this.isOpen.set(false);
      this.searchTerm.set(''); // Réinitialise la recherche
    }
  }

  /**
   * Sélectionne une option et met à jour la valeur
   * OBJECTIF :
   * - Enregistrer la valeur sélectionnée
   * - Notifier Angular (FormControl) du changement
   * - Émettre un événement pour le composant parent
   * - Fermer le dropdown
   * 
   * @param option - Option sélectionnée
   * @param event - Événement du clic
   */
  selectOption(option: SelectOption, event: Event): void {
    if (this.disabled) return;

    event.stopPropagation(); // Évite la propagation au document
    
    this.selectedValue.set(option.value); // Met à jour l'UI
    this.onChange(option.value); // Notifie Angular (FormControl)
    this.valueChange.emit(option.value); // Notifie le parent
    
    this.closeDropdown();
    this.markAsTouched();
  }

  /**
   * Met à jour le terme de recherche pendant la frappe
   * OBJECTIF : Filtrer les options en temps réel
   * @param event - Événement input du champ de recherche
   */
  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  /**
   * Empêche la fermeture du dropdown lors du clic sur le champ de recherche
   * OBJECTIF : Permettre de taper dans la recherche sans fermer le dropdown
   * @param event - Événement du clic
   */
  preventClose(event: Event): void {
    event.stopPropagation();
  }

  /**
   * Marque le champ comme "touché" (touched)
   * OBJECTIF : Activer la validation visuelle (afficher les erreurs)
   * QUAND ? Après la première interaction utilisateur
   */
  markAsTouched(): void {
    this.isTouched.set(true);
    this.onTouched(); // Notifie Angular
  }

  // ========================================
  // 🔍 GETTERS (Accessibilité)
  // ========================================
  
  /**
   * Vérifie si le champ est en état invalide
   * UTILISATION : {{ isInvalid ? 'Erreur' : 'OK' }}
   */
  get isInvalid(): boolean {
    return this.isInvalidClass;
  }

  /**
   * Vérifie si le champ est en état valide
   */
  get isValid(): boolean {
    return this.isValidClass;
  }

  // ========================================
  // 🔒 MÉTHODES PRIVÉES (Logique interne)
  // ========================================
  
  /**
   * Valide que la sélection actuelle existe dans les nouvelles options
   * OBJECTIF :
   * - Éviter d'avoir une valeur sélectionnée qui n'existe plus
   * - Reset automatique si l'option a disparu
   * 
   * CAS D'USAGE :
   * 1. Vous sélectionnez "Cocody" (commune d'Abidjan)
   * 2. Vous changez la ville pour "Bouaké"
   * 3. "Cocody" n'existe plus dans les options
   * 4. → Cette méthode reset automatiquement la commune
   * 
   * POURQUOI PRIVATE ?
   * - Appelée uniquement en interne (dans le setter options)
   * - Pas d'utilisation externe nécessaire
   */
  private validateCurrentSelection(): void {
    const currentValue = this.selectedValue();

    // Pas de validation si rien n'est sélectionné
    if (!currentValue) return;

    const opts = this.optionsSignal();
    const optionExists = opts.some(opt => opt.value === currentValue);

    // Si la valeur n'existe plus, on reset tout
    if (!optionExists) {
      this.selectedValue.set('');
      this.onChange('');
      this.valueChange.emit('');
    }
  }

  // ========================================
  // 🔄 MÉTHODES UTILITAIRES
  // ========================================
  
  /**
   * Réinitialise complètement le composant
   * OBJECTIF : Remettre à zéro tous les états
   * UTILISATION :
   * - Reset de formulaire
   * - Changement de contexte
   * 
   * @ViewChild('selectVille') selectVille!: SearchSelect;
   * this.selectVille.reset();
   */
  reset(): void {
    this.selectedValue.set('');
    this.searchTerm.set('');
    this.isOpen.set(false);
    this.isTouched.set(false);
  }
}