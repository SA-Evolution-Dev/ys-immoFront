import { Component, signal, inject, computed, OnInit } from '@angular/core';
import { RichTextEditor } from '../../../shared/components/rich-text-editor/rich-text-editor';
// import { Flatpickr } from '../../../shared/directives/flatpickr';
// import { DatePipe } from '@angular/common';
import { CurrencyInput } from '../../../shared/components/currency-input/currency-input';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { SearchSelect } from '../../../shared/components/search-select/search-select';
import { MultiSelect } from '../../../shared/components/multi-select/multi-select';
import { MultiSelectOption } from '../../../shared/components/multi-select/multi-select.model';

interface Commune {
  value: string;
  label: string;
}

@Component({
  selector: 'app-add-annonce',
  imports: [RichTextEditor, CurrencyInput, 
    CommonModule, ReactiveFormsModule, SearchSelect, MultiSelect],
  templateUrl: './add-annonce.html',
  styleUrl: './add-annonce.scss',
})
export class AddAnnonce implements OnInit {
  private fb = inject(FormBuilder);

  currentStep = signal(0);
  isSubmitting = signal(false);
  currentYear = new Date().getFullYear();

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
  liste_communes_par_ville: Record<string, Commune[]> = {
    abidjan: [
      { value: 'cocody', label: 'Cocody' },
      { value: 'yopougon', label: 'Yopougon' },
      { value: 'abobo', label: 'Abobo' },
      { value: 'treichville', label: 'Treichville' },
      { value: 'marcory', label: 'Marcory' },
      { value: 'koumassi', label: 'Koumassi' },
      { value: 'plateau', label: 'Plateau' },
      { value: 'port_bouet', label: 'Port-Bouët' },
      { value: 'attecoube', label: 'Attécoubé' },
      { value: 'adjame', label: 'Adjamé' },
      { value: 'songon', label: 'Songon' }
    ]
  };

  bienForm: FormGroup = this.fb.group({
    reference: ['', Validators.required],
    title: ['', Validators.required],
    description: ['', Validators.required],
    statut: ['actif', Validators.required],
    type: ['', Validators.required],
    contact: this.fb.group({
      nom: ['', Validators.required],
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
      nombreSallesBain: [0, [Validators.required, Validators.min(0)]],
      nombreCuisine: [0, [Validators.required, Validators.min(0)]],
      toilettesVisiteurs: [null, Validators.required]
    }),
    equipementsInterieurs: [[]],
    equipementsExterieurs: [[]],
    transaction: this.fb.group({
      transactionType: ['', Validators.required],
      prix: [0, [Validators.required, Validators.min(0)]],
      periodeLoyer: [''],
      devise: ['FCFA'],
      prixNegociable: [false],
      caution: [0, Validators.min(0)],
      avance: [0, Validators.min(0)]
    }),
    batiment: this.fb.group({
      anneeConstruction: [null, [Validators.min(1900), Validators.max(this.currentYear)]],
      etatConstruction: [''],
      typeConstruction: ['']
    }),
    medias: this.fb.group({
      photos: this.fb.array([]),
      videos: this.fb.array([])
    }),
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
    {value: 'chauffeEau', label: 'Chauffe-eau', badgeColor: 'secondary', icon: 'fas fa-temperature-half'},
    {value: 'placard', label: 'Placards intégrés', badgeColor: 'primary', icon: 'fas fa-box-open'},
    {value: 'fibreOptique', label: 'Fibre optique', badgeColor: 'primary', icon: 'fas fa-wifi'}
  ];

  // Options pour le multi-select exterior
  exteriorOptions: MultiSelectOption[] = [
    { value: 'jardin', label: 'Jardin', badgeColor: 'success', icon: 'fas fa-tree' },
    { value: 'cour', label: 'Cour privée', badgeColor: 'success', icon: 'fas fa-square' },
    { value: 'piscine', label: 'Piscine', badgeColor: 'info', icon: 'fas fa-swimming-pool' },
    { value: 'parking', label: 'Parking extérieur', badgeColor: 'primary', icon: 'fas fa-square-parking' },
    { value: 'garage', label: 'Garage fermé', badgeColor: 'primary', icon: 'fas fa-warehouse' },
    { value: 'balcon', label: 'Balcon', badgeColor: 'warning', icon: 'fas fa-building' },
    { value: 'terrasse', label: 'Terrasse', badgeColor: 'warning', icon: 'fas fa-layer-group' },
    { value: 'groupeElectrogene', label: 'Groupe électrogène', badgeColor: 'danger', icon: 'fas fa-bolt' },
    { value: 'gardien', label: 'Gardien / Surveillance', badgeColor: 'dark', icon: 'fas fa-shield-halved' }
  ];

  // Validation
  isFieldInvalid(fieldPath: string): boolean {
    const field = this.bienForm.get(fieldPath);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  // Soumission form
  onSubmitForm(): void {
    if (this.bienForm.valid) {
      this.isSubmitting.set(true);
            
      // Simulation envoi API
      // this.bienForm.reset();
      this.isSubmitting.set(false);
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
    this.bienForm.get('localisation.ville')?.valueChanges.subscribe((ville: string) => {
      const communes = this.liste_communes_par_ville[ville] ?? [];
      this.actual_communes.set(communes);

      // Reset de la commune
      this.bienForm.get('localisation.commune')?.setValue('', { emitEvent: false });
    });
  }

  getTransactionType(): string {
    return this.bienForm.get('transaction.transactionType')?.value || '';
  }




























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
}
