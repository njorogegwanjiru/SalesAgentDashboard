import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { Invoice } from '../../shared/models/invoice.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiResponse } from '../../shared/models/api-response.model';
import { School } from '../../shared/models/school.model';

@Injectable({
  providedIn: 'root'
})

export class InvoiceService {
  private apiUrl = 'https://api.jsonbin.io/v3/b/664a4001ad19ca34f86bfc91/';

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'X-BIN-META': 'FALSE',
    'X-Master-Key':'$2a$10$RLLhLvU0bWDNRlFD9l9lK.gFXc3xqcAd9JY0iTWxtIrAXY1HcKqzO',
    'X-ACCESS-KEY':'$2a$10$Gki27F0iNpxlmsMMTDZxheFRTtzlqhWQyOqatD7cZpOBSSVUUY/C2'
  });


  constructor(private http: HttpClient) { }

  getInvoices(): Observable<Invoice[]> {
    return this.http.get<ApiResponse>(this.apiUrl, { headers: this.headers }).pipe(
      map(response => response.record.invoices)
    );
  }

  addInvoice(invoice: Invoice): Observable<Invoice> {
    return this.http.get<ApiResponse>(this.apiUrl, { headers: this.headers }).pipe(
      map(response => {
        const invoices = response.record.invoices;
        invoice.id = invoices.length + 1; // Assign a new ID
        invoices.push(invoice); // Add the new invoice to the list
        return invoice; // Return the added invoice
      })
    );
  }

  updateInvoice(id: number, invoice: Invoice): Observable<Invoice> {
    return this.http.get<ApiResponse>(this.apiUrl, { headers: this.headers }).pipe(
      map(response => {
        const invoices = response.record.invoices;
        const index = invoices.findIndex(inv => inv.id === id);
        if (index === -1) {
          throw new Error('Invoice not found');
        }
        invoices[index] = invoice; // Update the invoice in the list
        return invoice; // Return the updated invoice
      })
    );
  }

  deleteInvoice(id: number): Observable<void> {
    return this.http.get<ApiResponse>(this.apiUrl, { headers: this.headers }).pipe(
      map(response => {
        const invoices = response.record.invoices;
        const index = invoices.findIndex(inv => inv.id === id);
        if (index === -1) {
          throw new Error('Invoice not found');
        }
        invoices.splice(index, 1); // Remove the invoice from the list
      })
    );
  }
}
