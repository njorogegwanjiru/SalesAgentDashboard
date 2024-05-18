export class Collection {
    id: number;  
    collectionNumber: string;
    invoiceNumber: string;
    dateOfCollection: string;
    status: string;  
    amount: number;
  
    constructor(id: number, collectionNumber: string, invoiceNumber: string, dateOfCollection: string, status: string, amount: number) {
        this.id = id;
        this.collectionNumber = collectionNumber;
        this.invoiceNumber = invoiceNumber;
        this.dateOfCollection = dateOfCollection;
        this.status = status;
        this.amount = amount;
    }
  }
  
  export interface ExtendedCollection extends Collection {
    schoolId?: number;
  }