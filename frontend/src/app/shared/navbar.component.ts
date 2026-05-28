import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../core/services/auth.service';
import { ThemeToggleComponent } from './theme-toggle.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, ThemeToggleComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  scrolled = false;
  mobileOpen = false;

  constructor(public authService: AuthService, private router: Router) {}

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled = window.scrollY > 12;
  }

  logout(): void {
    this.authService.logout();
    this.mobileOpen = false;
    this.router.navigate(['/login']);
  }

  isAdmin(): boolean {
    return this.authService.getRole() === 'ADMIN';
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  getUserName(): string {
    return this.authService.currentUserValue ? this.authService.currentUserValue.name : '';
  }

  getUserInitials(): string {
    const name = this.getUserName();
    if (!name) return '';
    return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  }

  toggleMobile(): void {
    this.mobileOpen = !this.mobileOpen;
  }

  closeMobile(): void {
    this.mobileOpen = false;
  }
}
