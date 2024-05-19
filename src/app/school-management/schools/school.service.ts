import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable,catchError,map, throwError } from 'rxjs';
import { School } from '../../shared/models/school.model';
import { ApiResponse } from '../../shared/models/api-response.model';
 
@Injectable({
  providedIn: 'root'
})
export class SchoolService {
  private apiUrl = 'https://api.jsonbin.io/v3/b/664a4001ad19ca34f86bfc91/';

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'X-BIN-META': 'FALSE',
  });

  constructor(private http: HttpClient) { }

  getSchools(): Observable<School[]> {
    return this.http.get<ApiResponse>(this.apiUrl, { headers: this.headers }).pipe(
      map(response => response.record.schools),
      catchError(error => {
        console.error('Error fetching schools:', error);
        return throwError(error);
      })
    );
  }

  getSchoolDetails(schoolId: number): Observable<School> {
    return this.getSchools().pipe(
      map(schools => {
        const school = schools.find(s => s.id === schoolId );
        console.log(schools)
        console.log("xx"+schoolId)
        if (!school) {
          throw new Error('School not found');
        }
        return school;
      }),
      catchError(error => {
        console.error('Error fetching school details:', error);
        return throwError(error);
      })
    );
  }
}
