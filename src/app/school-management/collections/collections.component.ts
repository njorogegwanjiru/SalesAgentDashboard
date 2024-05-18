import { Component, OnInit } from '@angular/core';
import { Collection, ExtendedCollection } from '../../shared/models/collection.model';
import { CollectionService } from './collection.service';
import { ActivatedRoute } from '@angular/router';

import { CommonModule } from '@angular/common';
import { NavbarComponentComponent } from "../../components/navbar-component/navbar-component.component";
import { InvoiceService } from '../invoices/invoice.service';
import { Invoice } from '../../shared/models/invoice.model';

@Component({
  selector: 'app-collections',
  standalone: true,
  templateUrl: './collections.component.html',
  styleUrl: './collections.component.css',
  imports: [CommonModule, NavbarComponentComponent]
})

export class CollectionsComponent implements OnInit {
  collections: ExtendedCollection[] = [];
  filteredCollections: ExtendedCollection[] = [];
  invoices: Invoice[] = [];

  schoolId: number | null = null;

  constructor(
    private collectionService: CollectionService,
    private invoiceService: InvoiceService,

    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.schoolId = Number(params.get('schoolId'));
      this.fetchData();
    });
  }

  fetchData(): void {
    this.invoiceService.getInvoices().subscribe((invoices: Invoice[]) => {
      this.invoices = invoices;
      this.collectionService.getCollections().subscribe((collections: Collection[]) => {
        this.collections = collections.map(collection => {
          const relatedInvoice = this.invoices.find(invoice => invoice.invoiceNumber === collection.invoiceNumber);
          return {
            ...collection,
            schoolId: relatedInvoice ? relatedInvoice.schoolId : undefined
          } as ExtendedCollection;
        });
        this.applyFilter();
      });
    });
  }

  applyFilter(): void {
    if (this.schoolId) {
      this.filteredCollections = this.collections.filter(collection => collection.schoolId === this.schoolId);
    } else {
      this.filteredCollections = this.collections;
    }
  }

  addCollection(): void {
    const newCollection: Collection = {
      id: this.collections.length + 1,
      collectionNumber: 'COL003',
      invoiceNumber: 'INV003',
      dateOfCollection: '2024-03-10',
      status: 'Valid',
      amount: 200
    };

    this.collectionService.addCollection(newCollection).subscribe((collection: Collection) => {
      this.collections.push(collection);
      this.applyFilter();
    });
  }

  updateCollectionStatus(id: number, newStatus: string): void {
    console.log(`Updating collection with ID ${id} to status ${newStatus}`);
    this.collectionService.updateCollectionStatus(id, newStatus).subscribe(() => {
      const collection = this.collections.find(col => col.id === id);
      if (collection) {
        console.log(`Found collection:`, collection);
        collection.status = newStatus;
        console.log(`Updated collection status to: ${newStatus}`);
      } else {
        console.log(`Collection with ID ${id} not found`);
      }
      this.applyFilter();
    });
  }
  

  deleteCollection(id: number): void {
    this.collectionService.deleteCollection(id).subscribe(() => {
      this.collections = this.collections.filter(collection => collection.id !== id);
    });
    this.applyFilter();
  }


}
