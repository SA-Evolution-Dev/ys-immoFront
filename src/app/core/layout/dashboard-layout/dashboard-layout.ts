import { Component, inject, computed } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth-service';

@Component({
  selector: 'app-dashboard-layout',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.scss',
})
export class DashboardLayout {
  private readonly authService = inject(AuthService);
  currentUser = this.authService.currentUser;

  avatarUrl = computed(() => {
    const user = this.currentUser();
    const name = user?.name ?? 'User';

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D6EFD&color=fff`;
  });

  userCurrent = computed(() => {
    const user = this.currentUser();
    return user
  });

}
