import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  signal,
  computed,
  ElementRef,
  HostListener,
  OnInit,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { MultiSelectOption } from './multi-select.model';

/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║  COMPOSANT : Multi-Select avec Tags                                        ║
 * ║  OBJECTIF  : Sélection multiple avec recherche, tags supprimables          ║
 * ║  FRAMEWORK : Angular 19+ Standalone + Phoenix CSS v1.24.0                  ║
 * ║  FEATURES  :                                                               ║
 * ║    ✅ Sélection multiple avec badges/tags                                  ║
 * ║    ✅ Recherche/filtrage des options                                       ║
 * ║    ✅ Suppression individuelle des tags                                    ║
 * ║    ✅ Compatible Reactive Forms (ControlValueAccessor)                     ║
 * ║    ✅ Navigation clavier (flèches, Enter, Escape)                          ║
 * ║    ✅ Fermeture au clic extérieur                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */
@Component({
  selector: 'app-multi-select',
  imports:  [CommonModule, FormsModule],
  templateUrl: './multi-select.html',
  styleUrl: './multi-select.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiSelect),
      multi: true
    }
  ]
})
export class MultiSelect implements ControlValueAccessor, OnInit, OnDestroy {
  // ══════════════════════════════════════════════════════════════════════════
  // INPUTS - Configuration du composant
  // ══════════════════════════════════════════════════════════════════════════

  /** Liste des options disponibles */
  @Input() options: MultiSelectOption[] = [];

  /** Identifiant unique du champ */
  @Input() id: string = 'multi-select-' + Math.random().toString(36).substring(2, 9);

  /** Label flottant (texte affiché) */
  @Input() label: string = 'Sélectionner';

  /** Placeholder quand aucune sélection */
  @Input() placeholder: string = 'Choisir...';

  /** Afficher l'icône de suppression sur chaque tag */
  @Input() removeItemButton: boolean = true;

  /** Activer la recherche/filtrage */
  @Input() searchable: boolean = true;

  /** Placeholder du champ de recherche */
  @Input() searchPlaceholder: string = 'Rechercher...';

  /** Nombre maximum de sélections (0 = illimité) */
  @Input() maxSelection: number = 0;

  /** Désactiver le composant */
  @Input() disabled: boolean = false;

  /** État invalide (bordure rouge) */
  @Input() isInvalid: boolean = false;

  /** État valide (bordure verte) */
  @Input() isValid: boolean = false;

  /** Message quand aucune option trouvée */
  @Input() noResultsText: string = 'Aucun résultat trouvé';

  /** Couleur par défaut des badges */
  @Input() defaultBadgeColor: string = 'primary';

  // ══════════════════════════════════════════════════════════════════════════
  // OUTPUTS - Événements émis
  // ══════════════════════════════════════════════════════════════════════════

  /** Émis quand la sélection change */
  @Output() selectionChange = new EventEmitter<(string | number)[]>();

  /** Émis quand un item est ajouté */
  @Output() itemAdded = new EventEmitter<MultiSelectOption>();

  /** Émis quand un item est supprimé */
  @Output() itemRemoved = new EventEmitter<MultiSelectOption>();

  /** Émis quand le dropdown s'ouvre */
  @Output() opened = new EventEmitter<void>();

  /** Émis quand le dropdown se ferme */
  @Output() closed = new EventEmitter<void>();

  // ══════════════════════════════════════════════════════════════════════════
  // SIGNALS - État réactif du composant
  // ══════════════════════════════════════════════════════════════════════════

  /** Dropdown ouvert ou fermé */
  isOpen = signal<boolean>(false);

  /** Valeurs sélectionnées (tableau de values) */
  selectedValues = signal<(string | number)[]>([]);

  /** Texte de recherche */
  searchQuery = signal<string>('');

  /** Index de l'option survolée (navigation clavier) */
  highlightedIndex = signal<number>(-1);

  // ══════════════════════════════════════════════════════════════════════════
  // COMPUTED - Valeurs calculées automatiquement
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * Options filtrées par la recherche
   * ---------------------------------
   * OBJECTIF : Afficher uniquement les options correspondant à la saisie
   */
  filteredOptions = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    
    if (!query) {
      return this.options;
    }
    
    return this.options.filter(option =>
      option.label.toLowerCase().includes(query)
    );
  });

  /**
   * Options sélectionnées (objets complets)
   * ---------------------------------------
   * OBJECTIF : Obtenir les objets MultiSelectOption des valeurs sélectionnées
   */
  selectedOptions = computed(() => {
    const values = this.selectedValues();
    return this.options.filter(option => values.includes(option.value));
  });

  /**
   * Options disponibles (non sélectionnées)
   * ---------------------------------------
   * OBJECTIF : Afficher uniquement les options non encore sélectionnées
   */
  availableOptions = computed(() => {
    const selected = this.selectedValues();
    return this.filteredOptions().filter(option => !selected.includes(option.value));
  });

  /**
   * Limite de sélection atteinte
   * ----------------------------
   * OBJECTIF : Désactiver la sélection si maxSelection atteint
   */
  isMaxReached = computed(() => {
    if (this.maxSelection === 0) return false;
    return this.selectedValues().length >= this.maxSelection;
  });

  /**
   * Texte d'aide pour la limite
   * ---------------------------
   * OBJECTIF : Informer l'utilisateur du nombre de sélections restantes
   */
  selectionCountText = computed(() => {
    const count = this.selectedValues().length;
    if (this.maxSelection === 0) {
      return `${count} sélectionné(s)`;
    }
    return `${count}/${this.maxSelection} sélectionné(s)`;
  });

  // ══════════════════════════════════════════════════════════════════════════
  // CONTROL VALUE ACCESSOR - Interface avec Reactive Forms
  // ══════════════════════════════════════════════════════════════════════════

  private onChangeFn: (value: (string | number)[]) => void = () => {};
  private onTouchedFn: () => void = () => {};

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    // Initialisation si nécessaire
  }

  ngOnDestroy(): void {
    // Nettoyage si nécessaire
  }

  /**
   * Écrire la valeur depuis le FormControl
   * --------------------------------------
   * OBJECTIF : Recevoir la valeur du formulaire parent
   */
  writeValue(value: (string | number)[] | null): void {
    if (value && Array.isArray(value)) {
      this.selectedValues.set(value);
    } else {
      this.selectedValues.set([]);
    }
  }

  /**
   * Enregistrer la fonction de callback onChange
   */
  registerOnChange(fn: (value: (string | number)[]) => void): void {
    this.onChangeFn = fn;
  }

  /**
   * Enregistrer la fonction de callback onTouched
   */
  registerOnTouched(fn: () => void): void {
    this.onTouchedFn = fn;
  }

  /**
   * Définir l'état désactivé depuis le FormControl
   */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // MÉTHODES PUBLIQUES - Actions utilisateur
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * Ouvrir/Fermer le dropdown
   * -------------------------
   * OBJECTIF : Toggle l'état du dropdown
   */
  toggleDropdown(event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (this.disabled) return;

    if (this.isOpen()) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  /**
   * Ouvrir le dropdown
   * ------------------
   * OBJECTIF : Afficher la liste des options
   */
  openDropdown(): void {
    if (this.disabled) return;

    this.isOpen.set(true);
    this.searchQuery.set('');
    this.highlightedIndex.set(-1);
    this.opened.emit();
  }

  /**
   * Fermer le dropdown
   * ------------------
   * OBJECTIF : Masquer la liste des options
   */
  closeDropdown(): void {
    this.isOpen.set(false);
    this.searchQuery.set('');
    this.highlightedIndex.set(-1);
    this.onTouchedFn();
    this.closed.emit();
  }

  /**
   * Sélectionner une option
   * -----------------------
   * OBJECTIF : Ajouter une option à la sélection
   * @param option - Option à sélectionner
   */
  selectOption(option: MultiSelectOption, event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    // Vérifications
    if (option.disabled) return;
    if (this.isMaxReached()) return;
    if (this.isSelected(option)) return;

    // Ajouter à la sélection
    const newValues = [...this.selectedValues(), option.value];
    this.updateSelection(newValues);
    
    // Émettre l'événement
    this.itemAdded.emit(option);

    // Réinitialiser la recherche
    this.searchQuery.set('');
    this.highlightedIndex.set(-1);
  }

  /**
   * Désélectionner une option
   * -------------------------
   * OBJECTIF : Retirer une option de la sélection
   * @param option - Option à retirer
   */
  removeOption(option: MultiSelectOption, event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (this.disabled) return;

    // Retirer de la sélection
    const newValues = this.selectedValues().filter(v => v !== option.value);
    this.updateSelection(newValues);
    
    // Émettre l'événement
    this.itemRemoved.emit(option);
  }

  /**
   * Supprimer toutes les sélections
   * -------------------------------
   * OBJECTIF : Réinitialiser complètement la sélection
   */
  clearAll(event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (this.disabled) return;

    this.updateSelection([]);
  }

  /**
   * Mettre à jour le texte de recherche
   * -----------------------------------
   * OBJECTIF : Filtrer les options en temps réel
   */
  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
    this.highlightedIndex.set(-1);
  }

  /**
   * Vérifier si une option est sélectionnée
   * ---------------------------------------
   * OBJECTIF : Afficher l'état de sélection dans la liste
   */
  isSelected(option: MultiSelectOption): boolean {
    return this.selectedValues().includes(option.value);
  }

  /**
   * Obtenir la couleur du badge pour une option
   * -------------------------------------------
   * OBJECTIF : Personnaliser l'apparence des tags
   */
  getBadgeColor(option: MultiSelectOption): string {
    return option.badgeColor || this.defaultBadgeColor;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // NAVIGATION CLAVIER
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * Gérer les touches clavier
   * -------------------------
   * OBJECTIF : Permettre la navigation et sélection au clavier
   */
  onKeyDown(event: KeyboardEvent): void {
    if (this.disabled) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.navigateDown();
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.navigateUp();
        break;

      case 'Enter':
        event.preventDefault();
        this.selectHighlighted();
        break;

      case 'Escape':
        event.preventDefault();
        this.closeDropdown();
        break;

      case 'Backspace':
        // Supprimer le dernier tag si le champ de recherche est vide
        if (this.searchQuery() === '' && this.selectedOptions().length > 0) {
          const lastOption = this.selectedOptions()[this.selectedOptions().length - 1];
          this.removeOption(lastOption);
        }
        break;
    }
  }

  /**
   * Naviguer vers le bas dans la liste
   */
  private navigateDown(): void {
    const options = this.availableOptions();
    const currentIndex = this.highlightedIndex();
    
    if (currentIndex < options.length - 1) {
      this.highlightedIndex.set(currentIndex + 1);
    } else {
      this.highlightedIndex.set(0);
    }
  }

  /**
   * Naviguer vers le haut dans la liste
   */
  private navigateUp(): void {
    const options = this.availableOptions();
    const currentIndex = this.highlightedIndex();
    
    if (currentIndex > 0) {
      this.highlightedIndex.set(currentIndex - 1);
    } else {
      this.highlightedIndex.set(options.length - 1);
    }
  }

  /**
   * Sélectionner l'option surlignée
   */
  private selectHighlighted(): void {
    const index = this.highlightedIndex();
    const options = this.availableOptions();
    
    if (index >= 0 && index < options.length) {
      this.selectOption(options[index]);
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  // MÉTHODES PRIVÉES
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * Mettre à jour la sélection et notifier le formulaire
   * ----------------------------------------------------
   * OBJECTIF : Synchroniser l'état interne avec le FormControl
   */
  private updateSelection(values: (string | number)[]): void {
    this.selectedValues.set(values);
    this.onChangeFn(values);
    this.selectionChange.emit(values);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // HOST LISTENER - Clic extérieur
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * Fermer le dropdown au clic extérieur
   * ------------------------------------
   * OBJECTIF : Améliorer l'UX en fermant automatiquement
   */
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      if (this.isOpen()) {
        this.closeDropdown();
      }
    }
  }

  /**
   * Track by pour optimiser le rendu des listes
   */
  trackByValue(index: number, option: MultiSelectOption): string | number {
    return option.value;
  }

}
