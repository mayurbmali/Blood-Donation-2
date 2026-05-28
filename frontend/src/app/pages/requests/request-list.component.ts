import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RequestService } from '../../core/services/request.service';
import { AuthService } from '../../core/services/auth.service';
import { BloodRequest } from '../../core/models/request.model';
import { RequestFormComponent } from './request-form.component';
import { StatusChipComponent } from '../../shared/status-chip.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog.component';

@Component({
  selector: 'app-request-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    StatusChipComponent
  ],
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.scss']
})
export class RequestListComponent implements OnInit {
  requests: BloodRequest[] = [];
  displayedColumns: string[] = ['requesterName', 'bloodGroup', 'units', 'status', 'createdAt', 'actions'];

  constructor(
    private requestService: RequestService,
    public authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    if (this.isAdmin()) {
      this.requestService.getAll().subscribe({
        next: (res) => {
          this.requests = res.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        },
        error: (err) => this.snackBar.open(err || 'Failed to load requests', 'Close', { duration: 3000 })
      });
    } else {
      this.requestService.getMyRequests().subscribe({
        next: (res) => {
          this.requests = res.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        },
        error: (err) => this.snackBar.open(err || 'Failed to load your requests', 'Close', { duration: 3000 })
      });
    }
  }

  isAdmin(): boolean {
    return this.authService.getRole() === 'ADMIN';
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(RequestFormComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.requestService.create(result).subscribe({
          next: () => {
            this.snackBar.open('Request submitted successfully!', 'Close', { duration: 3000 });
            this.loadRequests();
          },
          error: (err) => this.snackBar.open(err || 'Failed to submit request', 'Close', { duration: 5000 })
        });
      }
    });
  }

  updateStatus(request: BloodRequest, status: 'APPROVED' | 'REJECTED'): void {
    this.requestService.updateStatus(request.id, status).subscribe({
      next: () => {
        this.snackBar.open(`Request ${status.toLowerCase()} successfully!`, 'Close', { duration: 3000 });
        this.loadRequests();
      },
      error: (err) => this.snackBar.open(err || `Failed to update status`, 'Close', { duration: 5000 })
    });
  }

  deleteRequest(request: BloodRequest): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { message: `Are you sure you want to delete this request for ${request.requesterName}?` }
    });

    dialogRef.afterClosed().subscribe(confirm => {
      if (confirm) {
        this.requestService.delete(request.id).subscribe({
          next: () => {
            this.snackBar.open('Request deleted successfully!', 'Close', { duration: 3000 });
            this.loadRequests();
          },
          error: (err) => this.snackBar.open(err || 'Failed to delete request', 'Close', { duration: 5000 })
        });
      }
    });
  }
}
