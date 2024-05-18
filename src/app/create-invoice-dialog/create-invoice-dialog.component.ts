import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

import { Invoice } from '../shared/models/invoice.model';
import { InvoiceService } from '../school-management/invoices/invoice.service';

@Component({
  selector: 'app-create-invoice-dialog',
  standalone: true,
  imports: [MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,MatSelectModule, CommonModule, FormsModule],
  templateUrl: './create-invoice-dialog.component.html',
  styleUrl: './create-invoice-dialog.component.css'
})

export class CreateInvoiceDialogComponent implements OnInit {
  invoice: Invoice = {
    id: 0,
    schoolId:0,
    invoiceNumber: '',
    invoiceItem: '',
    creationDate: new Date(),
    dueDate: new Date(),
    amount: 0,
    paidAmount: 0,
    balance: 0,
    completionStatus: '',
    daysUntilDue: 0
  };

  constructor(public dialogRef: MatDialogRef<CreateInvoiceDialogComponent>,
    private invoiceService: InvoiceService
  ) { }

  ngOnInit(): void {
    this.generateInvoiceNumber()
  }
  generateInvoiceNumber(): void {
    const id = this.invoice.id + 1;
    const paddedId = id.toString().padStart(2, '0');
    this.invoice.invoiceNumber = `INV${paddedId}`;
  }

  create(): void {
       this.dialogRef.close(this.invoice);
   }

  cancel(): void {
    this.dialogRef.close();
  }

}