import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../../core/services/auth-service';

/**
 * Guard pour vérifier les rôles utilisateur
 */
export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRoles = route.data['roles'] as string[];

  if (!requiredRoles || requiredRoles.length === 0) {
    console.warn('[ROLE GUARD] Aucun rôle requis défini');
    return true;
  }

  const user = authService.getCurrentUser();

  if (!user) {
    console.warn('[ROLE GUARD] Utilisateur non trouvé');
    router.navigate(['/login']);
    return false;
  }

  const userRole = user.role?.toLowerCase();
  const hasRequiredRole = requiredRoles.some(role => 
    role.toLowerCase() === userRole
  );

  if (!hasRequiredRole) {
    console.warn('[ROLE GUARD] Rôle insuffisant:', {
      userRole,
      requiredRoles
    });
    router.navigate(['/unauthorized']);
    return false;
  }

  console.log('[ROLE GUARD] Accès autorisé - Rôle valide');
  return true;
};
