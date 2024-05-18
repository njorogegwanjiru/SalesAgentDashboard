import { ProductUsage } from "./productUsage.model";

export interface Metrics {
    totalCollections: number;
    totalSignUps: number;
    totalRevenue: number;
    numberOfBouncedInvoices: number;
    productUsage: { 
      'Zeraki Analytics': ProductUsage;
      'Zeraki Timetable': ProductUsage;
      'Zeraki Finance': ProductUsage;
    };
  }