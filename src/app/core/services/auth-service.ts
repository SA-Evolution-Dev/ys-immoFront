import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { EncryptionService } from './encryption.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly encryptionService = inject(EncryptionService);

  private readonly API_URL = `${environment.baseUrl}`;
  private readonly TOKEN_KEY = 'uDqCCJOF6m';
  private readonly REFRESH_TOKEN_KEY = 'QWEevBNASp';
  private readonly USER_KEY = 'FU9SZZETkgUS';

  // Signals pour Angular 19+
  private currentUserSubject = new BehaviorSubject<any>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated = signal<boolean>(this.hasToken());

  constructor() {
    this.checkAuthStatus();
    console.log('[AUTH SERVICE] Service initialisé avec cryptage activé');
  }

  /**
   * Inscription d'un nouvel utilisateur
   */
  register(data: any): Observable<any> {
    console.log('[AUTH SERVICE] Tentative d\'inscription:', { email: data.email });

    return this.http.post<any>(`${this.API_URL}/register`, data).pipe(
      tap((response: any) => {
        if (response.success) {
          console.log('✅ [AUTH SERVICE] Inscription réussie');
          this.handleAuthSuccess(response);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('[AUTH SERVICE] Erreur lors de l\'inscription:', {
          status: error.status,
          statusText: error.statusText,
          message: error.error?.message || error.message,
          errors: error.error?.errors || null
        });
        return throwError(() => error);
      })
    );
  }

  /**
   * Connexion d'un utilisateur
   */
  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/users/login`, credentials).pipe(
      tap((response: any) => {
        if (response.success) {
          this.handleAuthSuccess(response);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('[AUTH SERVICE] Erreur lors de la connexion:', {
          status: error.status,
          statusText: error.statusText,
          message: error.error?.message || error.message,
          errors: error.error?.errors || null
        });
        return throwError(() => error);
      })
    );
  }

  /**
   * Déconnexion de l'utilisateur
   */
  logout(): void {
    this.clearStorage();
    this.currentUserSubject.next(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/authentification']);

    console.log('[AUTH SERVICE] Déconnexion terminée');
  }

  /**
   * Gestion du succès d'authentification
   */
  private handleAuthSuccess(response: any): void {
    if (response.data?.accessToken) {
      this.setToken(response.data.accessToken);
    }

    if (response.data?.refreshToken) {
      this.setRefreshToken(response.data.refreshToken);
    }

    if (response.data?.user) {
      this.setUser(response.data.user);
      this.currentUserSubject.next(response.data.user);
    }

    this.isAuthenticated.set(true);
  }

   /**
   * Vérifier si l'utilisateur est authentifié
   */
  public isLoggedIn(): boolean {
    return this.hasToken() && !this.isTokenExpired();
  }

  /**
   * Obtenir le token actuel (décrypté)
   */
  public getToken(): string | null {
    try {
      const encryptedToken = localStorage.getItem(this.TOKEN_KEY);
      if (!encryptedToken) return null;

      const decryptedToken = this.encryptionService.decrypt(encryptedToken);
      return decryptedToken || null;
    } catch (error) {
      console.error('[AUTH SERVICE] Erreur lors de la récupération du token:', error);
      this.clearStorage();
      return null;
    }
  }

   /**
   * Obtenir l'utilisateur actuel
   */
  public getCurrentUser(): any | null {
    return this.currentUserSubject.value;
  }

  /**
   * Vérifier l'état d'authentification
   */
  private checkAuthStatus(): void {
    console.log('[AUTH SERVICE] Vérification de l\'état d\'authentification');

    const token = this.getToken();
    const user = this.getUserFromStorage();

    if (token && user && !this.isTokenExpired()) {
      this.isAuthenticated.set(true);
      this.currentUserSubject.next(user);
      console.log('[AUTH SERVICE] Session valide trouvée pour:', user.email || user.id);
    } else {
      this.clearStorage();
      this.isAuthenticated.set(false);
      console.log('[AUTH SERVICE] Aucune session valide');
    }
  }

   /**
   * Vérifier si le token est expiré
   */
  public isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp;
      const now = Math.floor(Date.now() / 1000);

      const isExpired = expiry < now;      
      return isExpired;
    } catch (error) {
      console.error('❌ [AUTH SERVICE] Erreur lors de la vérification du token:', error);
      return true;
    }
  }

  /**
   * Sauvegarder le token (crypté)
   */
  private setToken(token: string): void {
    try {
      const encryptedToken = this.encryptionService.encrypt(token);
      localStorage.setItem(this.TOKEN_KEY, encryptedToken);
    } catch (error) {
      console.error('[AUTH SERVICE] Erreur lors du cryptage du token:', error);
    }
  }

  /**
   * Sauvegarder le refresh token (crypté)
   */
  private setRefreshToken(refreshToken: string): void {
    try {
      const encryptedRefreshToken = this.encryptionService.encrypt(refreshToken);
      localStorage.setItem(this.REFRESH_TOKEN_KEY, encryptedRefreshToken);
      console.log('🔐 Refresh token crypté et stocké');
    } catch (error) {
      console.error('[AUTH SERVICE] Erreur lors du cryptage du refresh token:', error);
    }
  }

  /**
   * Sauvegarder l'utilisateur (crypté)
   */
  private setUser(user: any): void {
    try {
      const encryptedUser = this.encryptionService.encryptObject(user);
      localStorage.setItem(this.USER_KEY, encryptedUser);
    } catch (error) {
      console.error('[AUTH SERVICE] Erreur lors du cryptage des données utilisateur:', error);
    }
  }

  /**
   * Récupérer l'utilisateur du storage (décrypté)
   */
  private getUserFromStorage(): any | null {
    try {
      const encryptedUser = localStorage.getItem(this.USER_KEY);
      if (!encryptedUser) return null;

      const user = this.encryptionService.decryptObject(encryptedUser);
      return user;
    } catch (error) {
      console.error('[AUTH SERVICE] Erreur lors de la lecture des données utilisateur:', error);
      return null;
    }
  }

  /**
   * Obtenir le refresh token (décrypté)
   */
  private getRefreshToken(): string | null {
    try {
      const encryptedRefreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
      if (!encryptedRefreshToken) return null;

      return this.encryptionService.decrypt(encryptedRefreshToken);
    } catch (error) {
      console.error('[AUTH SERVICE] Erreur lors de la récupération du refresh token:', error);
      return null;
    }
  }

  /**
   * Nettoyer le storage
   */
  private clearStorage(): void {
    console.log('[AUTH SERVICE] Nettoyage du storage');
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  /**
   * Rafraîchir le token
   */
  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      console.error('[AUTH SERVICE] Aucun refresh token disponible');
      return throwError(() => new Error('No refresh token'));
    }

    return this.http.post<any>(`${this.API_URL}/refresh`, { refreshToken }).pipe(
      tap((response: any) => {
        if (response.success && response.token) {
          this.setToken(response.token);
          console.log('[AUTH SERVICE] Token rafraîchi avec succès');
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('[AUTH SERVICE] Erreur lors du rafraîchissement du token:', error);
        this.logout();
        return throwError(() => error);
      })
    );
  }

  /**
   * Méthode de debug pour voir les données cryptées
   */
  public debugEncryptedData(): void {
    console.group('DEBUG - Données cryptées dans localStorage');
    
    const token = localStorage.getItem(this.TOKEN_KEY);
    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
    const user = localStorage.getItem(this.USER_KEY);
    
    console.log('Token crypté:', token);
    console.log('Refresh token crypté:', refreshToken);
    console.log('User crypté:', user);
    
    console.groupEnd();
    
    console.group('🔓 DEBUG - Données décryptées');
    console.log('Token décrypté:', this.getToken());
    console.log('Refresh token décrypté:', this.getRefreshToken());
    console.log('User décrypté:', this.getUserFromStorage());
    console.groupEnd();
  }

  public hasToken(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);
    return token !== null && token !== undefined && token.length > 0;
  }

  
}
