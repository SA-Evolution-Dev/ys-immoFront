import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class AnnonceService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly API_URL = `${environment.baseUrl}`;

  constructor() {
  }

  addAnnonce(data: any): Observable<any> {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('statut', data.statut);
    formData.append('type', data.type);
    formData.append('surface', data.surface);
    // Objets → JSON.stringify
    formData.append('contact', JSON.stringify(data.contact));
    formData.append('localisation', JSON.stringify(data.localisation));
    formData.append('composition', JSON.stringify(data.composition));
    formData.append('transaction', JSON.stringify(data.transaction));
    formData.append('visibilite', JSON.stringify(data.visibilite));
    // Tableaux → JSON.stringify
    formData.append('equipementsInterieurs', JSON.stringify(data.equipementsInterieurs || []));
    formData.append('equipementsExterieurs', JSON.stringify(data.equipementsExterieurs || []));

    if (data.medias && data.medias.length > 0) {
      console.log('📤 Ajout de', data.medias.length, 'fichiers');
      data.medias.forEach((file: File, index: number) => {
        console.log(`📁 Fichier ${index}:`, file.name, file.type, file.size);
        
        // ⚠️ Chaque fichier individuellement avec le même nom de champ
        formData.append('medias', file, file.name);
      });
    } else {
      console.warn('⚠️ Aucun fichier dans data.medias');
    }

    return this.http.post<any>(`${this.API_URL}/annonces/add-annonce`, formData).pipe(
      tap((response: any) => {
        if (response.success) {
          console.log('[AD SERVICE] Inscription réussie');
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

  private handleAuthSuccess(response: any): void {
    console.log('01: handleAuthSuccess', response);
  }
  
}
