import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { Collection } from '../shared/models/collection.model';
import { Invoice } from '../shared/models/invoice.model';
import { Metrics } from '../shared/models/metrics.model';
import { ProductUsage } from '../shared/models/productUsage.model';
import { map, switchMap } from 'rxjs/operators';
import { ApiResponse } from '../shared/models/api-response.model';

import { School } from '../shared/models/school.model';

@Injectable({
  providedIn: 'root'
})


export class DashboardService {

  constructor(private http: HttpClient) { }
  private apiUrl = 'https://api.jsonbin.io/v3/b/664a4001ad19ca34f86bfc91/';
   
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'X-BIN-META': 'FALSE',
  });

  getSchools(): Observable<School[]> {
    return this.http.get<ApiResponse>(this.apiUrl, { headers: this.headers }).pipe(
      map(response => response.record.schools)
    );
  }

  getInvoices(): Observable<Invoice[]> {
    return this.http.get<ApiResponse>(this.apiUrl, { headers: this.headers }).pipe(
      map(response => response.record.invoices)
    );
  }

  getCollections(): Observable<Collection[]> {
    return this.http.get<ApiResponse>(this.apiUrl, { headers: this.headers }).pipe(
      map(response => response.record.collections)
    );
  }


  fetchData(): Observable<any> {
    return forkJoin({
      schools: this.getSchools(),
      invoices: this.getInvoices(),
      collections: this.getCollections()
    });
  }

  // Calculate metrics
  calculateMetrics(data: any): Metrics {
    const totalCollections = data.collections.length;
    const totalSignUps = data.schools.length;
    const totalRevenue = data.collections.reduce((total: number, collection: any) => total + collection.amount, 0);
    const numberOfBouncedInvoices = data.collections.filter((collection: any) => collection.status === "Bounced").length;

    // Initialize product usage
    const productUsage: {
      'Zeraki Analytics': ProductUsage;
      'Zeraki Timetable': ProductUsage;
      'Zeraki Finance': ProductUsage;
    } = {
      'Zeraki Analytics': { Primary: 0, Secondary: 0, IGSE: 0 },
      'Zeraki Timetable': { Primary: 0, Secondary: 0, IGSE: 0 },
      'Zeraki Finance': { Primary: 0, Secondary: 0, IGSE: 0 }
    };

    // Calculate product usage
    data.schools.forEach((school: School) => {
      const product = school.product as 'Zeraki Analytics' | 'Zeraki Timetable' | 'Zeraki Finance';
      const type = school.type as 'Primary' | 'Secondary' | 'IGSE';

      if (productUsage[product] && productUsage[product][type] !== undefined) {
        productUsage[product][type] += 1;
      }
    });

    // Log the product usage for debugging
    console.log('Product Usage:', productUsage);

    return {
      totalCollections,
      totalSignUps,
      totalRevenue,
      numberOfBouncedInvoices,
      productUsage
    };
  }

  getUpcomingInvoices(daysUntilDue: number): Observable<any[]> {
    return this.getInvoices().pipe(
      map(invoices => invoices.filter(invoice => {
        const dueDate = new Date(invoice.dueDate);
        const today = new Date();
        const timeDiff = dueDate.getTime() - today.getTime();
        const dayDiff = timeDiff / (1000 * 3600 * 24);
        return dayDiff <= daysUntilDue;
      }))
    );
  }

  updateData(record: ApiResponse['record']): Observable<any> {
    return this.http.put(this.apiUrl, { record }, { headers: this.headers });
  }
  

  collectPayment(invoiceId: number, amount: number): Observable<any> {
    return this.http.get<ApiResponse>(this.apiUrl, { headers: this.headers }).pipe(
      switchMap((data: ApiResponse) => {
        // Find the invoice and update it
        const invoice = data.record.invoices.find(inv => inv.id === invoiceId);
        if (!invoice) {
          throw new Error('Invoice not found');
        }

        const updatedPaidAmount = invoice.paidAmount + amount;
        const updatedBalance = invoice.amount - updatedPaidAmount;

        invoice.paidAmount = updatedPaidAmount;
        invoice.balance = updatedBalance;

        // Create a new collection entry
        const newCollection:Collection = {
          id: Date.now() + Math.floor(Math.random() * 10000),
          collectionNumber: `COL${Date.now()}`,
          invoiceNumber: invoice.invoiceNumber,
          dateOfCollection: new Date().toISOString(),
          status: 'Valid',
          amount: amount
        };
        data.record.collections.push(newCollection);

        // Update the data on the server
        return this.updateData(data.record);
      })
    );
  }
}


