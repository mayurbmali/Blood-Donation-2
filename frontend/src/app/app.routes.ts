import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DonorListComponent } from './pages/donors/donor-list.component';
import { InventoryComponent } from './pages/inventory/inventory.component';
import { RequestListComponent } from './pages/requests/request-list.component';
import { DonationListComponent } from './pages/donations/donation-list.component';
import { LandingPageComponent } from './pages/landing/landing-page.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: LandingPageComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'donors', component: DonorListComponent, canActivate: [authGuard] },
  { path: 'inventory', component: InventoryComponent, canActivate: [authGuard] },
  { path: 'requests', component: RequestListComponent, canActivate: [authGuard] },
  { path: 'donations', component: DonationListComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
