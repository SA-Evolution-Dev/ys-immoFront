import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../core/services/auth-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Ne pas ajouter le token pour les routes d'authentification
  if (req.url.includes('/auth/login') || req.url.includes('/auth/register')) {
    return next(req);
  }

  // Ajouter le token si disponible
  if (token) {
    const clonedReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    
    console.log('[AUTH INTERCEPTOR] Token ajouté à la requête:', req.url);
    return next(clonedReq);
  }

  return next(req);
};
