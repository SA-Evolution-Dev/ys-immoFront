import { Component, inject, signal, HostListener, ElementRef } from '@angular/core';
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

  isMenuOpen = signal(false);
  isDropdownOpen = signal(false);
  isMegaMenuOpen = signal(false);

  constructor(private elementRef: ElementRef) {
    this.isAuthenticated.set(this.authService.isLoggedIn());
  }

  deconnexion(): void {
    this.authService.logout();
  }

  toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }

  toggleDropdown() {
    this.isDropdownOpen.update(v => !v);
  }

  toggleMegaMenu() {
    this.isMegaMenuOpen.update(v => !v);
  }

  closeDropdown() {
    this.isDropdownOpen.set(false);
  }

  closeMegaMenu() {
    this.isMegaMenuOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.closeDropdown();
      this.closeMegaMenu();
    }
  }

}
