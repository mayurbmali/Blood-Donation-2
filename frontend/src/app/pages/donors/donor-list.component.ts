import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DonorService } from '../../core/services/donor.service';
import { AuthService } from '../../core/services/auth.service';
import { Donor, AdminCreateDonorRequest } from '../../core/models/donor.model';
import { DonorFormComponent } from './donor-form.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog.component';

@Component({
  selector: 'app-donor-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './donor-list.component.html',
  styleUrls: ['./donor-list.component.scss']
})
export class DonorListComponent implements OnInit {
  donors: Donor[] = [];
  filteredDonors: Donor[] = [];
  donorProfile: Donor | null = null;
  displayedColumns: string[] = ['name', 'bloodGroup', 'age', 'phone', 'lastDonation', 'actions'];

  constructor(
    private donorService: DonorService,
    public authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    if (this.isAdmin()) {
      this.donorService.getAll().subscribe({
        next: (res) => {
          this.donors = res;
          this.filteredDonors = res;
        },
        error: (err) => this.snackBar.open(err || 'Failed to load donors', 'Close', { duration: 3000 })
      });
    } else {
      this.donorService.getMyProfile().subscribe({
        next: (res) => {
          this.donorProfile = res;
        },
        error: () => {
          this.donorProfile = null;
        }
      });
    }
  }

  isAdmin(): boolean {
    return this.authService.getRole() === 'ADMIN';
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredDonors = this.donors.filter(donor =>
      donor.user.name.toLowerCase().includes(filterValue) ||
      donor.phone.includes(filterValue)
    );
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(DonorFormComponent, {
      width: '500px',
      data: { mode: 'add' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      if (result.mode === 'adminCreate') {
        this.donorService.adminCreateDonor(result.payload as AdminCreateDonorRequest).subscribe({
          next: () => {
            this.snackBar.open('Donor account created successfully!', 'Close', { duration: 3000 });
            this.loadData();
          },
          error: (err) => this.snackBar.open(err || 'Failed to create donor', 'Close', { duration: 5000 })
        });
      }
    });
  }

  openSelfCreateDialog(): void {
    const dialogRef = this.dialog.open(DonorFormComponent, {
      width: '450px',
      data: { mode: 'self' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.donorService.createMyProfile(result.donor).subscribe({
          next: () => {
            this.snackBar.open('Donor profile created!', 'Close', { duration: 3000 });
            this.loadData();
          },
          error: (err) => this.snackBar.open(err || 'Failed to create profile', 'Close', { duration: 5000 })
        });
      }
    });
  }

  openEditDialog(donor: Donor): void {
    const dialogRef = this.dialog.open(DonorFormComponent, {
      width: '450px',
      data: { mode: 'edit', donor }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      this.donorService.update(donor.id, result.donor).subscribe({
        next: () => {
          this.snackBar.open('Donor updated successfully!', 'Close', { duration: 3000 });
          this.loadData();
        },
        error: (err) => this.snackBar.open(err || 'Failed to update donor', 'Close', { duration: 5000 })
      });
    });
  }

  deleteDonor(donor: Donor): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { message: `Are you sure you want to delete donor ${donor.user.name}?` }
    });

    dialogRef.afterClosed().subscribe(confirm => {
      if (confirm) {
        this.donorService.delete(donor.id).subscribe({
          next: () => {
            this.snackBar.open('Donor deleted successfully!', 'Close', { duration: 3000 });
            this.loadData();
          },
          error: (err) => this.snackBar.open(err || 'Failed to delete donor', 'Close', { duration: 5000 })
        });
      }
    });
  }
}
