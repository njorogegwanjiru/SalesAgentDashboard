import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable,map } from 'rxjs';
import { School } from '../../shared/models/school.model';
import { ApiResponse } from '../../shared/models/api-response.model';
 
@Injectable({
  providedIn: 'root'
})
export class SchoolService {
  private apiUrl = 'https://api.jsonbin.io/v3/b/664921c0acd3cb34a84a0579/';

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'X-BIN-META': 'FALSE',
  });

  constructor(private http: HttpClient) { }

  getSchools(): Observable<School[]> {
    return this.http.get<ApiResponse>(this.apiUrl, { headers: this.headers }).pipe(
      map(response => response.record.schools)
    );
  }

  getSchoolDetails(schoolId: number): Observable<School> {
    const url = `${this.apiUrl}/schools/${schoolId}`;
    return this.http.get<ApiResponse>(url, { headers: this.headers }).pipe(
      map(response => {
        const school = response.record.schools.find(s => s.id === schoolId);
        if (!school) {
          throw new Error('School not found');
        }
        return school;
      })
    );
  }
}
