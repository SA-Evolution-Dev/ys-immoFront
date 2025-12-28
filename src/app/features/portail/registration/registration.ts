import { RouterLink } from '@angular/router';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth-service';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Subject } from 'rxjs/internal/Subject';

@Component({
  selector: 'app-registration',
  imports: [RouterLink, ReactiveFormsModule, CommonModule, LoadingSpinnerComponent ],
  templateUrl: './registration.html',
  styleUrl: './registration.scss',
})
export class Registration {
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private destroy$ = new Subject<void>();

  public isLoading = signal(false);
  public toto = signal(false);
  public errorMessage = signal('');
  public isRegisterAccount = signal(false);
  public resendEmail = signal<string>('');

  public spinnerTitle = signal('Création de votre compte...');
  public spinnerMessage = signal('Nous préparons votre espace personnel');

  ngOnInit(): void {

    this.registerForm.get('role')?.valueChanges.subscribe(value => {
      const corporateControl = this.registerForm.get('corporateName');

      if (!corporateControl) return;

      if (value === 'entreprise') {
        corporateControl.setValidators([Validators.required]);
      } else {
        corporateControl.clearValidators();
        corporateControl.setErrors(null);
      }

      corporateControl.updateValueAndValidity({ emitEvent: false });
      corporateControl.markAsTouched(); // FORCER l’affichage des erreurs
    });
  }
  
  public registerForm: FormGroup = this.fb.group({
    role: ['', Validators.required],
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    corporateName: [''],
    corporateLogo: [''],
    password: ['', [
      Validators.required,
      Validators.minLength(6),
      this.passwordStrengthValidator
    ]],
    confirmPassword: ['', [
      Validators.required,
      Validators.minLength(8)
    ]],
    acceptTerms: [false, [Validators.requiredTrue]]
  }, {
    validators: this.passwordMatchValidator
  });


  // Validateur de force du mot de passe
  private passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.value;
    
    if (!password) {
      return null; // Laisse Validators.required gérer le champ vide
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumeric = /[0-9]/.test(password);
    const hasSpecialChar = /[@$!%*?&]/.test(password);

    const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar;

    return !passwordValid ? { 
      passwordStrength: {
        message: 'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial (@$!%*?&)'
      }
    } : null;
  }


  // Validateur de correspondance des mots de passe
  private passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    // Si confirmPassword est vide, laisse Validators.required gérer
    if (!confirmPassword) {
      return null;
    }

    // Vérifie la correspondance
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched()
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.register(this.registerForm.value).subscribe({
      next: (response) => {
        console.log('✅ Inscription réussie:', response);
        this.resendEmail.set(response.data.user.email);
        this.isLoading.set(false);
        this.isRegisterAccount.set(true);
      },
      error: (error) => {
        console.error('❌ Erreur d\'inscription:', error);
        this.isLoading.set(false);
        this.isRegisterAccount.set(false);
        this.errorMessage.set(
          error.error?.message || 'Une erreur est survenue lors de l\'inscription'
        );
      }
    });
  }

  onLogoChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.registerForm.patchValue({
        corporateLogo: input.files[0]
      });

      this.registerForm.get('corporateLogo')?.updateValueAndValidity();
    }
  }

  // Getter pour accès facile aux contrôles
  get f() {
    return this.registerForm.controls;
  }

  resendActivationEmail(): void {
    const email = this.resendEmail();

    if (!email || this.isLoading()) {
      return;
    }

    this.spinnerTitle.set("Renvoi du mail d'activation en cours...");
    this.spinnerMessage.set('Veuillez patienter');

    this.isLoading.set(true);

    this.authService.resendActivation(email)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isRegisterAccount.set(true);
          this.isLoading.set(false);
        },
        error: (error) => {
          this.isRegisterAccount.set(true);
          this.isLoading.set(false);
        }
      });
  }

}
