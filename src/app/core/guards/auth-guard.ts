import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../../core/services/auth-service';

/**
 * 🛡️ Guard pour protéger les routes nécessitant une authentification
 */
export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Vérifier si l'utilisateur a un token valide
  const hasToken = authService.hasToken();
  const isTokenExpired = authService.isTokenExpired();
  const isAuthenticated = hasToken && !isTokenExpired;

  if (isAuthenticated) {    
    // Optionnel : Vérifier les rôles si nécessaire
    const requiredRoles = route.data['roles'] as string[] | undefined;
    if (requiredRoles) {
      const userHasRole = checkUserRoles(authService, requiredRoles);
      if (!userHasRole) {
        router.navigate(['/unauthorized']);
        return false;
      }
    }

    return true;
  } else {
    // Sauvegarder l'URL demandée pour redirection après login
    const returnUrl = state.url;
    
    // Rediriger vers la page de connexion avec l'URL de retour
    router.navigate(['/login'], {
      queryParams: { returnUrl: returnUrl }
    });
    
    return false;
  }
};

/**
 * Vérifier si l'utilisateur a les rôles requis
 */
function checkUserRoles(authService: AuthService, requiredRoles: string[]): boolean {
  const user = authService.getCurrentUser();
  
  if (!user || !user.role) {
    return false;
  }

  const userRole = user.role.toLowerCase();
  const hasRole = requiredRoles.some(role => role.toLowerCase() === userRole);

  return hasRole;
}
