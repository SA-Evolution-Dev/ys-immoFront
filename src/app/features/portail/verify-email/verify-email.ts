// src/app/pages/verify-email/verify-email.component.ts
import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../core/services/auth-service';

type VerificationStatus = 'loading' | 'success' | 'error' | 'expired';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'danger' | 'warning' | 'info';
}

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './verify-email.html',
  styleUrls: ['./verify-email.scss']
})
export class VerifyEmail implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private destroy$ = new Subject<void>();

  // Signals
  status = signal<any>('loading');
  message = signal<string>('Vérification de votre email en cours...');
  email = signal<string>('');
  resendEmail = signal<string>('');
  isResending = signal<boolean>(false);
  emailError = signal<string>('');
  toasts = signal<Toast[]>([]);
  
  // Propriétés
  currentYear = new Date().getFullYear();
  private redirectTimer?: number;
  private toastIdCounter = 0;
  private token: string | null = null;

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token');
    if (!this.token) {
      this.handleError('Token d\'activation manquant', 'INVALID_TOKEN');
      return;
    }
    this.verifyToken(this.token);
  }


  /**
   * Vérifier le token d'activation
   */
  private verifyToken(token: string): void {
    this.authService.verifyEmail(token)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            this.handleSuccess(response);
          }
        },
        error: (error) => {
          this.handleErrorResponse(error);
        }
      });
  }


  private handleSuccess(response: any): void {
    console.log('handleSuccess ', response);
    
    this.status.set('success');
    this.message.set(response.message);
    this.email.set(response.data?.email || '');
        
    // Redirection automatique après 1min
    this.redirectTimer = window.setTimeout(() => {
      this.goToLogin();
    }, 60000);
  }

  goToLogin(): void {
    this.router.navigate(['/authentification'], {
      queryParams: { 
        activated: this.status() === 'success' ? 'true' : undefined 
      }
    });
  }

  private handleErrorResponse(error: any): void {
    const errorResponse = error.error.errors as any;
    
    switch (errorResponse.errorCode) {
      case 'TOKEN_EXPIRED':
        this.status.set('expired');
        this.message.set(errorResponse.message);
        this.email.set(errorResponse.email || '');
        this.resendEmail.set(errorResponse.email || '');
        break;
        
      case 'ALREADY_ACTIVATED':
        this.handleError(errorResponse.message, 'ALREADY_ACTIVATED');
        // Redirection automatique
        // this.redirectTimer = window.setTimeout(() => {
        //   this.goToLogin();
        // }, 3000);
        break;
        
      case 'INVALID_TOKEN':
        this.handleError('Le lien d\'activation est invalide ou a déjà été utilisé.', 'INVALID_TOKEN');
        break;
        
      default:
        this.handleError(
          errorResponse.message || 'Une erreur inattendue s\'est produite.',
          'UNKNOWN_ERROR'
        );
    }
  }

  private handleError(message: string, code: string): void {
    this.status.set('error');
    this.message.set(message);
    console.error(`Erreur d'activation [${code}]:`, message);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    
    if (this.redirectTimer) {
      clearTimeout(this.redirectTimer);
    }
  }


  validateEmail(): void {
    const email = this.resendEmail();
    
    if (!email) {
      this.emailError.set('');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
      this.emailError.set('Format d\'email invalide');
    } else {
      this.emailError.set('');
    }
  }



  /**
   * Renvoyer un email d'activation
   */
  resendActivationEmail(): void {
    const email = this.resendEmail();
    
    if (!email || this.isResending() || this.emailError()) {
      return;
    }

    this.isResending.set(true);

    this.authService.resendActivation(email)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isResending.set(false);
          
          // Redirection vers login après 3 secondes
          setTimeout(() => {
            this.goToLogin();
          }, 3000);
        },
        error: (error) => {
          const errorMsg = error.error?.message || 'Erreur lors de l\'envoi de l\'email';
          this.isResending.set(false);
        }
      });
  }

  /**
   * Réessayer la vérification
   */
  retry(): void {
    if (this.token) {
      this.status.set('loading');
      this.message.set('Nouvelle tentative de vérification...');
      this.verifyToken(this.token);
    }
  }

  /**
   * Navigation vers la page d'accueil
   */
  goToHome(): void {
    this.router.navigate(['/']);
  }
}
