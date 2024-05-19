import { School } from '../models/school.model';
import { Invoice } from '../models/invoice.model';
import { Collection } from '../models/collection.model';

export interface ApiResponse {
  record: {
    schools: School[];
    invoices: Invoice[];
    collections: Collection[];
  };
}
