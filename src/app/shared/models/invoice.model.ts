export interface Invoice {
  id: number;  
  invoiceNumber: string;
  schoolId: number;
  invoiceItem: string;
  creationDate: Date;
  dueDate: Date;
  amount: number;
  paidAmount: number;
  balance: number;
  completionStatus: string;
  daysUntilDue: number;
}

  