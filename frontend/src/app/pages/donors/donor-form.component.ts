import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Donor } from '../../core/models/donor.model';

@Component({
  selector: 'app-donor-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './donor-form.component.html',
  styleUrls: ['./donor-form.component.scss']
})
export class DonorFormComponent implements OnInit {
  donorForm!: FormGroup;
  isEditMode = false;
  hidePassword = true;

  bloodGroups = [
    { value: 'A_POS', label: 'A+' },
    { value: 'A_NEG', label: 'A-' },
    { value: 'B_POS', label: 'B+' },
    { value: 'B_NEG', label: 'B-' },
    { value: 'AB_POS', label: 'AB+' },
    { value: 'AB_NEG', label: 'AB-' },
    { value: 'O_POS', label: 'O+' },
    { value: 'O_NEG', label: 'O-' }
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DonorFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mode: 'add' | 'edit' | 'self'; donor?: Donor }
  ) {}

  get isSelfMode(): boolean { return this.data.mode === 'self'; }
  get isAdminAdd(): boolean { return this.data.mode === 'add'; }

  ngOnInit(): void {
    this.isEditMode = this.data.mode === 'edit';
    const donor = this.data.donor;

    if (this.isAdminAdd) {
      this.donorForm = this.fb.group({
        name:      ['', Validators.required],
        email:     ['', [Validators.required, Validators.email]],
        password:  ['', [Validators.required, Validators.minLength(6)]],
        bloodGroup:['', Validators.required],
        age:       ['', [Validators.required, Validators.min(18), Validators.max(65)]],
        phone:     ['', Validators.required]
      });
    } else {
      this.donorForm = this.fb.group({
        bloodGroup:[donor ? donor.bloodGroup : '', Validators.required],
        age:       [donor ? donor.age : '', [Validators.required, Validators.min(18), Validators.max(65)]],
        phone:     [donor ? donor.phone : '', Validators.required]
      });
    }
  }

  onSubmit(): void {
    if (this.donorForm.invalid) return;

    const formVal = this.donorForm.getRawValue();

    if (this.isAdminAdd) {
      this.dialogRef.close({
        mode: 'adminCreate',
        payload: {
          name:       formVal.name,
          email:      formVal.email,
          password:   formVal.password,
          bloodGroup: formVal.bloodGroup,
          age:        Number(formVal.age),
          phone:      formVal.phone
        }
      });
    } else {
      this.dialogRef.close({
        mode: this.data.mode,
        donor: {
          bloodGroup: formVal.bloodGroup,
          age:        Number(formVal.age),
          phone:      formVal.phone
        },
        donorId: this.data.donor?.id
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
