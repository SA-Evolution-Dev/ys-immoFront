import { RouterLink } from '@angular/router';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registration',
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './registration.html',
  styleUrl: './registration.scss',
})
export class Registration {
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  public isLoading = signal(false);
  public errorMessage = signal('');

  public registerForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    firstName: [''],
    lastName: ['']
  });

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.register(this.registerForm.value).subscribe({
      next: (response) => {
        console.log('✅ Inscription réussie:', response);
        this.isLoading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('❌ Erreur d\'inscription:', error);
        this.isLoading.set(false);
        this.errorMessage.set(
          error.error?.message || 'Une erreur est survenue lors de l\'inscription'
        );
      }
    });
  }




}
