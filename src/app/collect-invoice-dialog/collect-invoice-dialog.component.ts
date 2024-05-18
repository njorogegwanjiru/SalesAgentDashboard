import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';   
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-collect-invoice-dialog',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,FormsModule, MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,],
  templateUrl: './collect-invoice-dialog.component.html',
  styleUrl: './collect-invoice-dialog.component.css',
 
})
export class CollectInvoiceDialogComponent {
  collectForm!: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CollectInvoiceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.collectForm = this.fb.group({
      amount: [0, [Validators.required, Validators.min(0.01)]]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onCollectClick(): void {
    if (this.collectForm.valid) {
      this.dialogRef.close(this.collectForm.value);
    }
  }
}
