import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { School } from '../../shared/models/school.model';
 
@Injectable({
  providedIn: 'root'
})
export class SchoolService {
  private schools: School[] = [
    { id: 1, name: 'School A', type: 'Primary', product: 'Zeraki Analytics', county: 'Nairobi', registrationDate: '2023-01-15', contactInformation: '123456789', balance: 5000 },
    { id: 2, name: 'School B', type: 'Secondary', product: 'Zeraki Finance', county: 'Mombasa', registrationDate: '2022-11-20', contactInformation: '987654321', balance: 8000 },
    { id: 3, name: 'School B', type: 'Secondary', product: 'Zeraki Finance', county: 'Mombasa', registrationDate: '2022-11-20', contactInformation: '987654321', balance: 8000 },
    { id: 4, name: 'School B', type: 'Secondary', product: 'Zeraki Finance', county: 'Mombasa', registrationDate: '2022-11-20', contactInformation: '987654321', balance: 8000 },
    { id: 5, name: 'School B', type: 'Secondary', product: 'Zeraki Finance', county: 'Mombasa', registrationDate: '2022-11-20', contactInformation: '987654321', balance: 8000 },
    { id: 6, name: 'School B', type: 'Secondary', product: 'Zeraki Finance', county: 'Mombasa', registrationDate: '2022-11-20', contactInformation: '987654321', balance: 8000 },
    { id: 7, name: 'School B', type: 'Secondary', product: 'Zeraki Finance', county: 'Mombasa', registrationDate: '2022-11-20', contactInformation: '987654321', balance: 8000 },
  ];
  apiUrl!: String;
  http!: HttpClient;

  constructor() { }

  getSchools(): School[] {
    return this.schools;
  }

  getSchoolDetails(schoolId: string): Observable<School> {
    const url = `${this.apiUrl}/schools/${schoolId}`;  
    return this.http.get<School>(url);
  }
}
