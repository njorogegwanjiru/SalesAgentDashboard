import { Component, Inject } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Invoice } from '../shared/models/invoice.model';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-edit-invoice-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CommonModule,FormsModule],
  templateUrl: './edit-invoice-dialog.component.html',
  styleUrl: './edit-invoice-dialog.component.css'
})
export class EditInvoiceDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EditInvoiceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Invoice
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

    onUpdateClick(): void {
    this.dialogRef.close(this.data); // Send the updated invoice data back
  }

}
