import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DonorService } from '../../core/services/donor.service';
import { Donor } from '../../core/models/donor.model';

@Component({
  selector: 'app-donation-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './donation-form.component.html',
  styleUrls: ['./donation-form.component.scss']
})
export class DonationFormComponent implements OnInit {
  donationForm!: FormGroup;
  donors: Donor[] = [];

  constructor(
    private fb: FormBuilder,
    private donorService: DonorService,
    public dialogRef: MatDialogRef<DonationFormComponent>
  ) {}

  ngOnInit(): void {
    this.donationForm = this.fb.group({
      donorId: ['', Validators.required],
      unitsDonated: [1, [Validators.required, Validators.min(1)]],
      donationDate: [new Date(), Validators.required]
    });

    this.loadDonors();
  }

  loadDonors(): void {
    this.donorService.getAll().subscribe({
      next: (res) => this.donors = res,
      error: () => this.donors = []
    });
  }

  onSubmit(): void {
    if (this.donationForm.invalid) {
      return;
    }

    const formVal = this.donationForm.value;
    
    const date = new Date(formVal.donationDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    const payload = {
      donorId: formVal.donorId,
      unitsDonated: formVal.unitsDonated,
      donationDate: formattedDate
    };

    this.dialogRef.close(payload);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
