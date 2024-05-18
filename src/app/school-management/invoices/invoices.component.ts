import { Component, OnInit } from '@angular/core';
import { Invoice } from '../../shared/models/invoice.model';
import { InvoiceService } from './invoice.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { NavbarComponentComponent } from "../../components/navbar-component/navbar-component.component";
import { MatDialog } from '@angular/material/dialog';
import { EditInvoiceDialogComponent } from '../../edit-invoice-dialog/edit-invoice-dialog.component';
import { CreateInvoiceDialogComponent } from '../../create-invoice-dialog/create-invoice-dialog.component';
import { CollectInvoiceDialogComponent } from '../../collect-invoice-dialog/collect-invoice-dialog.component';
import { DashboardService } from '../../dashboard/dashboard.service';

@Component({
  selector: 'app-invoices',
  standalone: true,
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css'],
  imports: [CommonModule, FormsModule, NavbarComponentComponent]
})
export class InvoicesComponent implements OnInit {
  invoices: Invoice[] = [];
  filteredInvoices: Invoice[] = [];
  selectedInvoice: Invoice | null = null;
  schoolId: number | null = null;

  searchText: string = '';
  selectedFilter: string = 'all';

  constructor(
    private dashboardService: DashboardService,
    private invoiceService: InvoiceService,
    private route: ActivatedRoute,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.schoolId = Number(params.get('schoolId'));
      this.fetchInvoices();
    });
  }

  fetchInvoices(): void {
    this.invoiceService.getInvoices().subscribe((data: Invoice[]) => {
      this.invoices = data;
      if (this.schoolId) {
        this.filteredInvoices = this.invoices.filter(invoice => invoice.schoolId === this.schoolId);
      } else {
        this.filteredInvoices = this.invoices;
      }
    });
  }

  createInvoice(newInvoice: Invoice): void {
    this.invoiceService.addInvoice(newInvoice).subscribe((invoice: Invoice) => {
      this.invoices.push(invoice);
      this.applyFilter(); // Update filtered list
    });
  }

  openEditInvoiceDialog(invoice: Invoice): void {
    const dialogRef = this.dialog.open(EditInvoiceDialogComponent,
      {
        width: '800px',
        data: { ...invoice }
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateInvoice(result);
      }
    });
  }

  openCreateInvoiceDialog(): void {
    const dialogRef = this.dialog.open(CreateInvoiceDialogComponent,
      { width: '800px', });

    dialogRef.afterClosed().subscribe(result => {
      this.createInvoice(result)
    });
  }

  openCollectInvoiceDialog(invoice: Invoice): void {
    const dialogRef = this.dialog.open(CollectInvoiceDialogComponent, {
      width: '400px',
      data: { ...invoice }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.collectPayment(invoice.id, result.amount);
      }
    });
  }

  updateInvoice(updatedInvoice: Invoice): void {
    // Check if the amount, paid amount, or balance has been updated
    const amountUpdated = this.invoices.find(invoice => invoice.id === updatedInvoice.id)?.amount !== updatedInvoice.amount;
    const paidAmountUpdated = this.invoices.find(invoice => invoice.id === updatedInvoice.id)?.paidAmount !== updatedInvoice.paidAmount;
    const balanceUpdated = this.invoices.find(invoice => invoice.id === updatedInvoice.id)?.balance !== updatedInvoice.balance;

    // Recalculate amount, paid amount, or balance based on what has been updated
    if (amountUpdated) {
      updatedInvoice.balance = updatedInvoice.amount - updatedInvoice.paidAmount;
    } else if (paidAmountUpdated) {
      updatedInvoice.balance = updatedInvoice.amount - updatedInvoice.paidAmount;
    } else if (balanceUpdated) {
      if (updatedInvoice.amount !== undefined && updatedInvoice.paidAmount === undefined) {
        updatedInvoice.paidAmount = updatedInvoice.amount - updatedInvoice.balance;
      } else if (updatedInvoice.paidAmount !== undefined && updatedInvoice.amount === undefined) {
        updatedInvoice.amount = updatedInvoice.balance + updatedInvoice.paidAmount;
      } else {
        updatedInvoice.paidAmount = updatedInvoice.amount - updatedInvoice.balance;
      }
    }

    // Update the invoice via the service
    this.invoiceService.updateInvoice(updatedInvoice.id, updatedInvoice).subscribe(() => {
      // Update the invoice in the list
      this.invoices = this.invoices.map(invoice =>
        invoice.id === updatedInvoice.id ? updatedInvoice : invoice
      );

      // Update filtered list
      this.applyFilter();
    });
  }

  deleteInvoice(id: number): void {
    this.invoiceService.deleteInvoice(id).subscribe(() => {
      this.invoices = this.invoices.filter(invoice => invoice.id !== id);
      this.applyFilter(); // Update filtered list
    });
  }

  collectPayment(invoiceId: number, amount: number): void {
    this.dashboardService.collectPayment(invoiceId, amount).subscribe(response => {
      console.log('Payment collected:', response);
      this.fetchInvoices();
    });
  }



  cancelEdit(): void {
    this.selectedInvoice = null; // Cancel editing
  }

  applySearch(): void {
    this.applyFilter();
  }

  applyFilter(): void {
    this.filteredInvoices = this.invoices.filter(invoice => {
      const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(this.searchText.toLowerCase())
        || invoice.invoiceItem.toLowerCase().includes(this.searchText.toLowerCase())
        || invoice.creationDate.toString().toLowerCase().includes(this.searchText.toLowerCase())
        || invoice.dueDate.toString().toLowerCase().includes(this.searchText.toLowerCase());

      const matchesFilter = this.selectedFilter === 'all' || invoice.completionStatus.toLowerCase() === this.selectedFilter.toLowerCase();

      return matchesSearch && matchesFilter;
    });
  }
}
