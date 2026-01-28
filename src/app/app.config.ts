import { ApplicationConfig, provideBrowserGlobalErrorListeners, 
provideZonelessChangeDetection, LOCALE_ID  } from '@angular/core';
import { provideRouter } from '@angular/router';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors  } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

// Enregistrer la locale française
registerLocaleData(localeFr);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    provideRouter(routes),
    { provide: LOCALE_ID, useValue: 'fr-FR' }, 
  ]
};
