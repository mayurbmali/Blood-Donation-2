import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { StatusChipComponent } from '../../shared/status-chip.component';
import { DonorService } from '../../core/services/donor.service';
import { RequestService } from '../../core/services/request.service';
import { InventoryService } from '../../core/services/inventory.service';
import { AuthService } from '../../core/services/auth.service';
import { BloodInventory } from '../../core/models/inventory.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    StatusChipComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  totalDonors = 0;
  totalRequests = 0;
  pendingRequests = 0;
  bloodTypesAvailable = 0;
  inventoryList: BloodInventory[] = [];
  displayedColumns: string[] = ['bloodGroup', 'unitsAvailable', 'status'];

  constructor(
    private donorService: DonorService,
    private requestService: RequestService,
    private inventoryService: InventoryService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    if (this.authService.getRole() === 'ADMIN') {
      this.donorService.getAll().subscribe({
        next: (donors) => this.totalDonors = donors.length,
        error: () => this.totalDonors = 0
      });
      
      this.requestService.getAll().subscribe({
        next: (reqs) => {
          this.totalRequests = reqs.length;
          this.pendingRequests = reqs.filter(r => r.status === 'PENDING').length;
        },
        error: () => {
          this.totalRequests = 0;
          this.pendingRequests = 0;
        }
      });
    } else {
      this.requestService.getMyRequests().subscribe({
        next: (reqs) => {
          this.totalRequests = reqs.length;
          this.pendingRequests = reqs.filter(r => r.status === 'PENDING').length;
        },
        error: () => {
          this.totalRequests = 0;
          this.pendingRequests = 0;
        }
      });
      this.donorService.getMyProfile().subscribe({
        next: () => this.totalDonors = 1,
        error: () => this.totalDonors = 0
      });
    }

    this.inventoryService.getAll().subscribe({
      next: (inv) => {
        this.inventoryList = inv;
        this.bloodTypesAvailable = inv.filter(i => i.unitsAvailable > 0).length;
      },
      error: () => {
        this.inventoryList = [];
        this.bloodTypesAvailable = 0;
      }
    });
  }

  isAdmin(): boolean {
    return this.authService.getRole() === 'ADMIN';
  }

  getStockStatusLabel(units: number): string {
    if (units === 0) return 'CRITICAL';
    if (units < 5) return 'LOW';
    return 'OK';
  }
}
