import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { Collection } from '../shared/models/collection.model';
import { Invoice } from '../shared/models/invoice.model';
import { Metrics } from '../shared/models/metrics.model';
import { ProductUsage } from '../shared/models/productUsage.model';
import { map, switchMap } from 'rxjs/operators';  

import { School } from '../shared/models/school.model';

@Injectable({
  providedIn: 'root'
})


export class DashboardService {

  constructor(private http: HttpClient) { }
  private apiUrl = 'http://localhost:3000/';
  private collectionsUrl = 'http://localhost:3000/collections';
  private invoicesUrl = 'http://localhost:3000/invoices';

  // Fetch data from your API endpoint
  getSchools(): Observable<School[]> {
    return this.http.get<School[]>(`${this.apiUrl}schools`);
  }

  getInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.apiUrl}invoices`);
  }

  getCollections(): Observable<Collection[]> {
    return this.http.get<Collection[]>(`${this.apiUrl}collections`);
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

  collectPayment(invoiceId: number, amount: number): Observable<any> {
    return this.http.get<Invoice>(`${this.invoicesUrl}/${invoiceId}`).pipe(
      switchMap((invoice: Invoice) => {
        const updatedPaidAmount = invoice.paidAmount + amount;
        const updatedBalance = invoice.amount - updatedPaidAmount;

        return forkJoin({
          updateInvoice: this.http.patch(`${this.invoicesUrl}/${invoiceId}`, {
            paidAmount: updatedPaidAmount,
            balance: updatedBalance
          }),
          addCollection: this.http.post(this.collectionsUrl, {
            collectionNumber: `COL${Date.now()}`,
            invoiceNumber: invoice.invoiceNumber,
            dateOfCollection: new Date().toISOString(),
            status: 'Valid',
            amount: amount
          })
        });
      })
    );
  }
}
 

