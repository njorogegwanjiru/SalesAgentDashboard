export interface School {
  id: number;
  name: string;
  type: 'Primary' | 'Secondary' | 'IGSE';  
  product: 'Zeraki Analytics' | 'Zeraki Timetable' | 'Zeraki Finance';  
  county: string;
  registrationDate: string;
  contactInformation: string;
  balance: number;
}


