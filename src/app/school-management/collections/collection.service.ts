import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Collection } from '../../shared/models/collection.model';

@Injectable({
  providedIn: 'root'
})

export class CollectionService {
  private apiUrl = 'http://localhost:3000/collections';

  constructor(private http: HttpClient) { }

  // Method to get all collections
  getCollections(): Observable<Collection[]> {
    return this.http.get<Collection[]>(this.apiUrl);
  }

  // Method to add a new collection
  addCollection(collection: Collection): Observable<Collection> {
    return this.http.post<Collection>(this.apiUrl, collection);
  }

  // Method to update the status of a collection
  updateCollectionStatus(id: number, newStatus: string): Observable<Collection> {
    return this.http.patch<Collection>(`${this.apiUrl}/${id}`, { status: newStatus });
  }

  // Method to delete a collection
  deleteCollection(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
