import { Component, OnInit } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SideNavigationComponent } from '../components/side-navigation/side-navigation.component';
import { NavbarComponentComponent } from "../components/navbar-component/navbar-component.component";
import { DashboardService } from './dashboard.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';

import Chart from 'chart.js/auto';
import { Observable, forkJoin } from 'rxjs';
import { Metrics } from '../shared/models/metrics.model';
import { Invoice } from '../shared/models/invoice.model';
import { CollectInvoiceDialogComponent } from '../collect-invoice-dialog/collect-invoice-dialog.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  imports: [MatTooltipModule, SideNavigationComponent, NavbarComponentComponent, FormsModule, CommonModule]
})

export class DashboardComponent implements OnInit {
  metrics: Metrics = {
    totalCollections: 0,
    totalSignUps: 0,
    totalRevenue: 0,
    numberOfBouncedInvoices: 0,
    productUsage: {
      'Zeraki Analytics': { Primary: 0, Secondary: 0, IGSE: 0 },
      'Zeraki Timetable': { Primary: 0, Secondary: 0, IGSE: 0 },
      'Zeraki Finance': { Primary: 0, Secondary: 0, IGSE: 0 }
    }
  };
  upcomingInvoices: Invoice[] = [];

  constructor(private dashboardService: DashboardService,
    public dialog: MatDialog) { }


  ngOnInit(): void {
    this.dashboardService.fetchData().subscribe(data => {
      this.metrics = this.dashboardService.calculateMetrics(data);
      console.log(this.metrics.productUsage);
      this.renderCharts();
    });
    this.getUpcomingInvoices(5);
  }


  fetchData(): Observable<any> {
    const schools$ = this.dashboardService.getSchools();
    const invoices$ = this.dashboardService.getInvoices();
    const collections$ = this.dashboardService.getCollections();

    return forkJoin({ schools: schools$, invoices: invoices$, collections: collections$ });
  }

  getUpcomingInvoices(daysUntilDue: number): void {
    this.dashboardService.getUpcomingInvoices(daysUntilDue).subscribe(invoices => {
      this.upcomingInvoices = invoices;
      console.log(this.upcomingInvoices);
    });
  }

  collectPayment(invoiceId: number, amount: number): void {
    this.dashboardService.collectPayment(invoiceId, amount).subscribe(
      response => {
        console.log('Payment collected:', response);
        this.fetchDataAndUpdateMetrics();
      },
      error => {
        console.error('Error collecting payment:', error);
      }
    );
  }
  
  fetchDataAndUpdateMetrics(): void {
    this.dashboardService.fetchData().subscribe(
      data => {
        this.metrics = this.dashboardService.calculateMetrics(data);
        this.getUpcomingInvoices(5);
      },
      error => {
        console.error('Error fetching data:', error);
      }
    );
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

  renderCharts() {
    // Data for pie charts
    const pieChartData = {
      analytics: [
        this.metrics.productUsage['Zeraki Analytics'].IGSE +
        this.metrics.productUsage['Zeraki Analytics'].Primary +
        this.metrics.productUsage['Zeraki Analytics'].Secondary,
        50
      ],
      finance: [
        this.metrics.productUsage['Zeraki Finance'].IGSE +
        this.metrics.productUsage['Zeraki Finance'].Primary +
        this.metrics.productUsage['Zeraki Finance'].Secondary,
        40
      ],
      timetable: [
        this.metrics.productUsage['Zeraki Timetable'].IGSE +
        this.metrics.productUsage['Zeraki Timetable'].Primary +
        this.metrics.productUsage['Zeraki Timetable'].Secondary,
        45
      ]
    };


    // Data for bar charts
    const barChartData = {
      analytics: {
        primary: this.metrics.productUsage['Zeraki Analytics'].Primary,
        secondary: this.metrics.productUsage['Zeraki Analytics'].Secondary,
        igcse: this.metrics.productUsage['Zeraki Analytics'].IGSE
      },
      finance: {
        primary: this.metrics.productUsage['Zeraki Finance'].Primary,
        secondary: this.metrics.productUsage['Zeraki Finance'].Secondary,
        igcse: this.metrics.productUsage['Zeraki Finance'].IGSE
      },
      timetable: {
        primary: this.metrics.productUsage['Zeraki Timetable'].Primary,
        secondary: this.metrics.productUsage['Zeraki Timetable'].Secondary,
        igcse: this.metrics.productUsage['Zeraki Timetable'].IGSE
      }
    };

    // Options for both types of charts
    const pieOptions = {
      responsive: true,
      radius: '90%',
      options: {
        layout: {
          padding: {
            bottom: 0
          }
        }
      }
    };

    const barOptions = {
      responsive: true,
      scales: {
        x: { stacked: true },
        y: { stacked: true }
      },
      plugins: {
        legend: {
          display: false  // Hide the legend
        }
      }
    };

    // Render pie charts
    this.renderPieChart('analyticsChart', pieChartData.analytics, pieOptions);
    this.renderPieChart('financeChart', pieChartData.finance, pieOptions);
    this.renderPieChart('timetableChart', pieChartData.timetable, pieOptions);

    // Render bar charts
    this.renderBarChart('analyticsBarChart', barChartData.analytics, barOptions);
    this.renderBarChart('financeBarChart', barChartData.finance, barOptions);
    this.renderBarChart('timeTableBarChart', barChartData.timetable, barOptions);
  }

  renderPieChart(id: string, data: number[], options: any) {
    const ctx = document.getElementById(id) as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Target Achieved', 'Set Target'],
        datasets: [{
          data: data,
          backgroundColor: ['#8b2ec3', '#de892f']
        }]
      },
      options: options
    });
  }

  renderBarChart(id: string, data: any, options: any) {
    const ctx = document.getElementById(id) as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Primary', 'Secondary', 'IGCSE'],
        datasets: [{
          label: '',
          data: [data.primary, data.secondary, data.igcse],
          backgroundColor: ['#0074a8', '#8b2ec3', '#de892f'] // Colors for different school types
        }]
      },
      options: options
    });
  }
}


