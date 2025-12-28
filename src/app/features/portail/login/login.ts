import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth-service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';


@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LoadingSpinnerComponent],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private http = inject(HttpClient);

  public isLoading = signal(false);
  public errorMessage = signal('');

  public loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  public spinnerTitle = signal('Connexion en cours ...');
  public spinnerMessage = signal('Veuillez patienter');

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        // Pour débugger et voir les données cryptées/décryptées
        // this.authService.debugEncryptedData();
        this.isLoading.set(false);
        this.router.navigate(['/tableau-de-bord']);
      },
      error: (error) => {
        console.error('Erreur de connexion:', error);
        this.isLoading.set(false);
        this.errorMessage.set(
          error.error?.message || 'Identifiants incorrects'
        );
      }
    });
  }

}
