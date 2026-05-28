import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { StatusChipComponent } from '../../shared/status-chip.component';
import { InventoryService } from '../../core/services/inventory.service';
import { AuthService } from '../../core/services/auth.service';
import { BloodInventory } from '../../core/models/inventory.model';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
    StatusChipComponent
  ],
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {
  inventoryList: BloodInventory[] = [];
  editingGroupId: number | null = null;
  editUnitsValue: number = 0;

  constructor(
    private inventoryService: InventoryService,
    public authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadInventory();
  }

  loadInventory(): void {
    this.inventoryService.getAll().subscribe({
      next: (res) => {
        const order = ['A_POS', 'A_NEG', 'B_POS', 'B_NEG', 'AB_POS', 'AB_NEG', 'O_POS', 'O_NEG'];
        this.inventoryList = res.sort((a, b) => order.indexOf(a.bloodGroup) - order.indexOf(b.bloodGroup));
      },
      error: (err) => this.snackBar.open(err || 'Failed to load inventory', 'Close', { duration: 3000 })
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

  getBarWidth(units: number): string {
    const max = 50;
    const pct = Math.min(Math.round((units / max) * 100), 100);
    return pct + '%';
  }

  startEdit(item: BloodInventory): void {
    this.editingGroupId = item.id;
    this.editUnitsValue = item.unitsAvailable;
  }

  cancelEdit(): void {
    this.editingGroupId = null;
  }

  saveEdit(item: BloodInventory): void {
    if (this.editUnitsValue < 0) {
      this.snackBar.open('Units cannot be negative', 'Close', { duration: 3000 });
      return;
    }

    this.inventoryService.update({
      bloodGroup: item.bloodGroup,
      unitsAvailable: this.editUnitsValue
    }).subscribe({
      next: () => {
        this.snackBar.open('Stock updated successfully', 'Close', { duration: 3000 });
        this.editingGroupId = null;
        this.loadInventory();
      },
      error: (err) => this.snackBar.open(err || 'Failed to update stock', 'Close', { duration: 3000 })
    });
  }
}
