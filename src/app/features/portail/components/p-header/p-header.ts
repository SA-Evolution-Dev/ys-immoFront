import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../core/services/auth-service';

@Component({
  selector: 'app-p-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './p-header.html',
  styleUrl: './p-header.scss',
})
export class PHeader {
  private readonly authService = inject(AuthService);
  public isAuthenticated = signal<boolean>(false);

  constructor() {
    this.isAuthenticated.set(this.authService.isLoggedIn());
  }

  deconnexion(): void {
    this.authService.logout();
  }

}
