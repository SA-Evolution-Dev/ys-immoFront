import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { guestGuard } from './core/guards/guest.guard';
import { roleGuard } from './core/guards/role.guard';
import { VerifyEmail } from './features/portail/verify-email/verify-email';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./core/layout/public-layout/public-layout').then(m => m.PublicLayout),
        children: [
            {
                path: '',
                redirectTo: 'home',
                pathMatch: 'full'
            },
            {
                path: 'home',
                loadComponent: () => import('./features/portail/home/home').then(m => m.Home),
                title: 'Accueil'
            },
            {
                path: 'details-annonce',
                loadComponent: () => import('./features/portail/details-annonce/details-annonce').then(m => m.DetailsAnnonce),
                title: 'Details de annonce'
            },
            {
                path: 'liste-des-annonces',
                loadComponent: () => import('./features/portail/listing-annonces/listing-annonces').then(m => m.ListingAnnonces),
                title: 'Liste des annonces'
            },
            {
                path: 'contact',
                loadComponent: () => import('./features/portail/contact/contact').then(m => m.Contact),
                title: 'Contact'
            }
        ]
    },
    {
        path: 'tableau-de-bord',
        canActivate: [roleGuard],
        data: { roles: ['user', 'client'] },
        loadComponent: () => import('./core/layout/dashboard-layout/dashboard-layout').then(m => m.DashboardLayout),
        children: [
            {
                path: '',
                redirectTo: 'Administration',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: 'authentification',
        loadComponent: () => import('./features/portail/login/login').then(m => m.Login),
        canActivate: [guestGuard],
        title: 'Authentification'
    },
    {
        path: 'inscription',
        loadComponent: () => import('./features/portail/registration/registration').then(m => m.Registration),
        canActivate: [guestGuard],
        title: 'Inscription'
    },
    {
        path: 'verify-email/:token',
        component: VerifyEmail,
        title: 'Vérification de votre email'
    },
    { path: '**', redirectTo: 'home' }
];
