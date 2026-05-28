import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DonationService } from '../../core/services/donation.service';
import { DonorService } from '../../core/services/donor.service';
import { AuthService } from '../../core/services/auth.service';
import { DonationHistory } from '../../core/models/donation.model';
import { DonationFormComponent } from './donation-form.component';

@Component({
  selector: 'app-donation-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './donation-list.component.html',
  styleUrls: ['./donation-list.component.scss']
})
export class DonationListComponent implements OnInit {
  donations: DonationHistory[] = [];
  displayedColumns: string[] = ['donorName', 'bloodGroup', 'unitsDonated', 'donationDate'];

  constructor(
    private donationService: DonationService,
    private donorService: DonorService,
    public authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadDonations();
  }

  loadDonations(): void {
    if (this.isAdmin()) {
      this.donationService.getAll().subscribe({
        next: (res) => {
          this.donations = res.sort((a, b) => new Date(b.donationDate).getTime() - new Date(a.donationDate).getTime());
        },
        error: (err) => this.snackBar.open(err || 'Failed to load donations', 'Close', { duration: 3000 })
      });
    } else {
      this.donorService.getMyProfile().subscribe({
        next: (profile) => {
          this.donationService.getByDonor(profile.id).subscribe({
            next: (res) => {
              this.donations = res.sort((a, b) => new Date(b.donationDate).getTime() - new Date(a.donationDate).getTime());
            },
            error: (err) => this.snackBar.open(err || 'Failed to load personal donations', 'Close', { duration: 3000 })
          });
        },
        error: () => {
          this.donations = [];
        }
      });
    }
  }

  isAdmin(): boolean {
    return this.authService.getRole() === 'ADMIN';
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(DonationFormComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.donationService.add(result).subscribe({
          next: () => {
            this.snackBar.open('Donation logged successfully!', 'Close', { duration: 3000 });
            this.loadDonations();
          },
          error: (err) => this.snackBar.open(err || 'Failed to log donation', 'Close', { duration: 5000 })
        });
      }
    });
  }
}
