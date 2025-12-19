import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth-service';

/**
 * Guard pour empêcher l'accès aux pages publiques (login, register) 
 * si l'utilisateur est déjà connecté
 */
export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuthenticated = authService.hasToken() && !authService.isTokenExpired();

  if (isAuthenticated) {
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};
