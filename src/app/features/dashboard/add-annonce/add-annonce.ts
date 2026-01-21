import { Component, signal, inject, computed, OnInit, effect } from '@angular/core';
import { RichTextEditor } from '../../../shared/components/rich-text-editor/rich-text-editor';
// import { Flatpickr } from '../../../shared/directives/flatpickr';
// import { DatePipe } from '@angular/common';
import { CurrencyInput } from '../../../shared/components/currency-input/currency-input';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { SearchSelect } from '../../../shared/components/search-select/search-select';
import { MultiSelect } from '../../../shared/components/multi-select/multi-select';
import { MultiSelectOption } from '../../../shared/components/multi-select/multi-select.model';
import { VILLES_QUARTIERS } from '../../../shared/data/liste-quartiers-by-ville.data';
import { FileUpload } from '../../../shared/components/file-upload/file-upload';
import { AuthService } from '../../../core/services/auth-service';
import { AnnonceService } from '../../../core/services/annonce-service';
import Swal from 'sweetalert2';

interface Commune {
  value: string;
  label: string;
}

const TYPE_DEFAULTS: Record<string, { chambres: number; salons: number }> = {
  studio: { chambres: 0, salons: 1 },
  appartement: { chambres: 1, salons: 1 },
  villa: { chambres: 2, salons: 1 },
  // bureau: { chambres: 0, salons: 1 }
};

@Component({
  selector: 'app-add-annonce',
  imports: [RichTextEditor, CurrencyInput, 
    CommonModule, ReactiveFormsModule, SearchSelect, MultiSelect, FileUpload],
  templateUrl: './add-annonce.html',
  styleUrl: './add-annonce.scss',
})
export class AddAnnonce implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly annonceService = inject(AnnonceService);
  private fb = inject(FormBuilder);

  currentStep = signal(0);
  isSubmitting = signal(false);
  currentYear = new Date().getFullYear();
  currentUser = this.authService.currentUser;
  public uploadedFiles = signal<File[]>([]);
  public errorMessage = signal('');

  liste_villes = [
    { value: 'abidjan', label: 'Abidjan' },
    { value: 'yamoussoukro', label: 'Yamoussoukro' },
    { value: 'bouake', label: 'Bouaké' },
    { value: 'daloa', label: 'Daloa' },
    { value: 'san_pedro', label: 'San Pédro' },
    { value: 'korhogo', label: 'Korhogo' },
    { value: 'man', label: 'Man' },
    { value: 'gagnoa', label: 'Gagnoa' },
    { value: 'divo', label: 'Divo' },
    { value: 'abengourou', label: 'Abengourou' },
    { value: 'bondoukou', label: 'Bondoukou' },
    { value: 'agboville', label: 'Agboville' },
    { value: 'dimbokro', label: 'Dimbokro' },
    { value: 'odienne', label: 'Odienné' },
    { value: 'ferkessedougou', label: 'Ferkessédougou' },
    { value: 'issia', label: 'Issia' },
    { value: 'seguela', label: 'Séguéla' },
    { value: 'toumodi', label: 'Toumodi' },
    { value: 'bangolo', label: 'Bangolo' },
    { value: 'grand_bassam', label: 'Grand-Bassam' },
    { value: 'dabou', label: 'Dabou' },
    { value: 'anyama', label: 'Anyama' },
    { value: 'bingerville', label: 'Bingerville' },
    { value: 'bonoua', label: 'Bonoua' },
    { value: 'grand_lahou', label: 'Grand-Lahou' },
    { value: 'soubre', label: 'Soubré' },
    { value: 'sassandra', label: 'Sassandra' },
    { value: 'tabou', label: 'Tabou' },
    { value: 'duekoue', label: 'Duékoué' },
    { value: 'guiglo', label: 'Guiglo' },
    { value: 'touba', label: 'Touba' },
    { value: 'katiola', label: 'Katiola' },
    { value: 'dabakala', label: 'Dabakala' },
    { value: 'bouna', label: 'Bouna' },
    { value: 'tanda', label: 'Tanda' },
    { value: 'daoukro', label: 'Daoukro' },
    { value: 'bocanda', label: 'Bocanda' },
    { value: 'lakota', label: 'Lakota' },
    { value: 'tiassale', label: 'Tiassalé' },
    { value: 'sinfra', label: 'Sinfra' },
    { value: 'oume', label: 'Oumé' },
    { value: 'mankono', label: 'Mankono' },
    { value: 'kong', label: 'Kong' },
    { value: 'boundiali', label: 'Boundiali' },
    { value: 'tingrela', label: 'Tingréla' },
    { value: 'azuie', label: 'Azaguié' },
    { value: 'alepé', label: 'Alépé' },
    { value: 'jacqueville', label: 'Jacqueville' }
  ];

  actual_communes = signal<Commune[]>([]);
  liste_communes_par_ville = VILLES_QUARTIERS
  userCurrent = computed(() => {
    const user = this.currentUser();
    return user
  });

  bienForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    statut: ['actif', Validators.required],
    type: ['', Validators.required],
    surface: [''],
    contact: this.fb.group({
      nom: [this.userCurrent().nom, Validators.required],
      telephone: ['', Validators.required],
      email: ['']
    }),
    localisation: this.fb.group({
      ville: ['', Validators.required],
      commune: [''],
      adresse: [''],
      latitude: [null, [Validators.min(-90), Validators.max(90)]],
      longitude: [null, [Validators.min(-180), Validators.max(180)]]
    }),
    composition: this.fb.group({
      nombreChambres: [0, [Validators.required, Validators.min(0)]],
      nombreSalons: [0, [Validators.required, Validators.min(0)]],
      nombreSallesBain: [1, [Validators.required, Validators.min(0)]],
      nombreCuisine: [1, [Validators.required, Validators.min(0)]],
      toilettesVisiteurs: ['', Validators.required]
    }),
    equipementsInterieurs: [[]],
    equipementsExterieurs: [[]],
    transaction: this.fb.group({
      transactionType: ['', Validators.required],
      prix: [0, [Validators.required, Validators.min(5000)]],
      periodeLoyer: ['mois'],
      devise: ['FCFA'],
      prixNegociable: [false],
      caution: ['', Validators.min(0)],
      avance: ['', Validators.min(0)]
    }),
    batiment: this.fb.group({
      anneeConstruction: [''],
      etatConstruction: [''],
      typeConstruction: ['']
    }),
    medias: [[]],
    visibilite: this.fb.group({
      niveau: ['normal'],
      enVedette: [false]
    })
  });

  // Options pour le multi-select interior
  interiorOptions: MultiSelectOption[] = [
    {value: 'cuisineEquipee', label: 'Cuisine équipée', badgeColor: 'primary', icon: 'fas fa-utensils'},
    {value: 'baignoire', label: 'Baignoire', badgeColor: 'primary', icon: 'fas fa-bath'},
    {value: 'jacuzzi', label: 'Jacuzzi / Spa', badgeColor: 'primary', icon: 'fas fa-hot-tub'},
    {value: 'climatisation', label: 'Climatisation', badgeColor: 'primary', icon: 'fas fa-snowflake'},
    {value: 'chauffeEau', label: 'Chauffe-eau', badgeColor: 'primary', icon: 'fas fa-temperature-half'},
    {value: 'placard', label: 'Placards intégrés', badgeColor: 'primary', icon: 'fas fa-box-open'},
    {value: 'fibreOptique', label: 'Fibre optique', badgeColor: 'primary', icon: 'fas fa-wifi'}
  ];

  // Options pour le multi-select exterior
  exteriorOptions: MultiSelectOption[] = [
    { value: 'jardin', label: 'Jardin', badgeColor: 'primary', icon: 'fas fa-tree' },
    { value: 'cour', label: 'Cour privée', badgeColor: 'primary', icon: 'fas fa-square' },
    { value: 'piscine', label: 'Piscine', badgeColor: 'primary', icon: 'fas fa-swimming-pool' },
    { value: 'parking', label: 'Parking extérieur', badgeColor: 'primary', icon: 'fas fa-square-parking' },
    { value: 'garage', label: 'Garage fermé', badgeColor: 'primary', icon: 'fas fa-warehouse' },
    { value: 'balcon', label: 'Balcon', badgeColor: 'primary', icon: 'fas fa-building' },
    { value: 'terrasse', label: 'Terrasse', badgeColor: 'primary', icon: 'fas fa-layer-group' },
    { value: 'groupeElectrogene', label: 'Groupe électrogène', badgeColor: 'primary', icon: 'fas fa-bolt' },
    { value: 'gardien', label: 'Gardien / Surveillance', badgeColor: 'primary', icon: 'fas fa-shield-halved' }
  ];

  // Validation
  isFieldInvalid(fieldPath: string): boolean {
    const field = this.bienForm.get(fieldPath);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  // Soumission form
  onSubmitForm(): void {
    if (this.bienForm.valid) {

      Swal.fire({
        title: 'Confirmer la publication ?',
        text: 'Votre annonce sera visible par tous les utilisateurs',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3b82f6',
        cancelButtonColor: '#64748b',
        confirmButtonText: 'Oui, publier',
        cancelButtonText: 'Annuler'
      }).then((result) => {
        if (result.isConfirmed) {
          this.isSubmitting.set(true);
          this.errorMessage.set('');
          
          this.annonceService.addAnnonce(this.bienForm.value).subscribe({
            next: (response) => {
              console.log('✅ Annonce réussie:', response);
            },
            error: (error) => {
              console.error('❌ Erreur annonce:', error);
              this.isSubmitting.set(false);
              this.errorMessage.set(
                error.error?.message || 'Une erreur est survenue lors de la création'
              );
            }
          })
    
          // this.bienForm.reset();
          this.isSubmitting.set(false);
        }
      });

    } else {
      this.markFormGroupTouched(this.bienForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  getFieldError(fieldName: string, errorType: string): boolean {
    const field = this.bienForm.get(fieldName);
    return !!(field?.hasError(errorType) && (field?.dirty || field?.touched));
  }

  ngOnInit(): void {
    // Écouter les changements de ville
    this.bienForm.get('localisation.ville')?.valueChanges.subscribe((ville: string) => {
      const communes = this.liste_communes_par_ville[ville] ?? [];
      this.actual_communes.set(communes);

      // Reset de la commune
      this.bienForm.get('localisation.commune')?.setValue('', { emitEvent: false });
    });

    // Écouter les changements de transactionType
    this.bienForm.get('transaction.transactionType')?.valueChanges.subscribe(value => {
      const periodeLoyer = this.bienForm.get('transaction.periodeLoyer');
      const caution = this.bienForm.get('transaction.caution');
      const avance = this.bienForm.get('transaction.avance');

      if (value === 'location') {
        periodeLoyer?.setValidators([Validators.required]);
        caution?.setValidators([Validators.required]);
        avance?.setValidators([Validators.required]);
      } else {
        periodeLoyer?.clearValidators();
        caution?.clearValidators();
        avance?.clearValidators();
      }
      
      periodeLoyer?.updateValueAndValidity();
      caution?.updateValueAndValidity();
      avance?.updateValueAndValidity();
    });

    // Écouter les changements du champs type, mettre des valeurs par default
    const typeControl = this.bienForm.get('type');
    const compositionGroup = this.bienForm.get('composition');
    typeControl?.valueChanges.subscribe(val => {
      if (!val || !compositionGroup) return;

      const defaults = TYPE_DEFAULTS[val];
      if (!defaults) return;

      const isStudio = val === 'studio';
      const champsComposition = [
        'nombreChambres',
        'nombreSalons',
        'nombreSallesBain',
        'nombreCuisine',
        'toilettesVisiteurs'
      ];

      const studioDefaults: any = {
        nombreChambres: 0,
        nombreSalons: 1,
        nombreSallesBain: 1,
        nombreCuisine: 1,
        toilettesVisiteurs: false
      };

      champsComposition.forEach(field => {
        const ctrl = compositionGroup.get(field);
        if (!ctrl) return;

        if (isStudio) {
          ctrl.setValue(studioDefaults[field], { emitEvent: false });
          ctrl.disable({ emitEvent: false });                         
        } else {
          ctrl.enable({ emitEvent: false });                          
        }
      });

      const chambresCtrl = compositionGroup.get('nombreChambres');
      const salonsCtrl = compositionGroup.get('nombreSalons');

      if (!isStudio) {
        // ✅ Valeurs suggérées sans écraser l’utilisateur
        if (chambresCtrl?.pristine) {
          chambresCtrl.setValue(defaults.chambres);
        }

        if (salonsCtrl?.pristine) {
          salonsCtrl.setValue(defaults.salons);
        }
      }

      // mettre à jour l’UI
      chambresCtrl?.updateValueAndValidity();
      salonsCtrl?.updateValueAndValidity();
    });

  }

  getTransactionType(): string {
    return this.bienForm.get('transaction.transactionType')?.value || '';
  }

  onFilesSelected(files: File[]): void {
    this.uploadedFiles.set(files);

    if (files && files.length > 0) {
      this.bienForm.patchValue({
        medias: files
      });
    }
  }

  onFileRemoved(file: File): void {
    this.uploadedFiles.update(files => files.filter(f => f !== file));
  }

  onUploadComplete(uploads: any[]): void {
    console.log('Upload terminé:', uploads);
  }

  private findInvalidControlsRecursive(
    formGroup: FormGroup | FormArray,
    parentPath: string,
    invalidControls: { path: string; errors: any; value: any }[]
  ): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      const path = parentPath ? `${parentPath}.${key}` : key;

      if (control instanceof FormGroup || control instanceof FormArray) {
        // Récursion pour les groupes et arrays
        this.findInvalidControlsRecursive(control, path, invalidControls);
      } else {
        // FormControl
        if (control?.invalid) {
          invalidControls.push({
            path: path,
            errors: control.errors,
            value: control.value
          });
        }
      }
    });

    // How use
    // console.log('❌ Erreurs formulaire:', this.bienForm.errors);
    // const invalidControls: { path: string; errors: any; value: any }[] = [];
    // this.findInvalidControlsRecursive(this.bienForm, '', invalidControls);
    // if (invalidControls.length === 0) {
    //   console.log('✅ Aucun contrôle invalide trouvé');
    // } else {
    //   console.log(`❌ ${invalidControls.length} contrôle(s) invalide(s):`);
    //   console.table(invalidControls);
    // }
  }

  




























  content = signal('<p>Contenu initial</p>');
  advancedContent = signal('');
  isDisabled = signal(false);
  // errorMessage = signal('');

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

  annonce = {
    budget: 0,
    monthlyRent: 0,
    deposit: 0,
    agencyFees: 0
  };

  onSubmit() {
    console.log('Annonce:', this.annonce);
  }

  getTotal(): number {
    return this.annonce.budget + this.annonce.monthlyRent + 
           this.annonce.deposit + this.annonce.agencyFees;
  }

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


  constructor() {
    effect(() => {
      const user = this.userCurrent();
      const contactForm = this.bienForm.get('contact');

      if (user && contactForm?.pristine) {
        contactForm.patchValue({
          nom: user.name,
          email: user.email
        });
      }
    });
  }




}
