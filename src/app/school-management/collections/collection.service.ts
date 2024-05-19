import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Collection } from '../../shared/models/collection.model';
import { ApiResponse } from '../../shared/models/api-response.model';

@Injectable({
  providedIn: 'root'
})

export class CollectionService {
  private apiUrl = 'https://api.jsonbin.io/v3/b/664a4001ad19ca34f86bfc91/';

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'X-BIN-META': 'FALSE',
    'X-Master-Key':'$2a$10$RLLhLvU0bWDNRlFD9l9lK.gFXc3xqcAd9JY0iTWxtIrAXY1HcKqzO',
    'X-ACCESS-KEY':'$2a$10$Gki27F0iNpxlmsMMTDZxheFRTtzlqhWQyOqatD7cZpOBSSVUUY/C2'
  });

  constructor(private http: HttpClient) { }

  getCollections(): Observable<Collection[]> {
    return this.http.get<ApiResponse>(this.apiUrl, { headers: this.headers }).pipe(
      map(response => response.record.collections)
    );
  }

  addCollection(collection: Collection): Observable<Collection> {
    return this.http.get<ApiResponse>(this.apiUrl, { headers: this.headers }).pipe(
      map(response => {
        const collections = response.record.collections;
        collection.id = Date.now() + Math.floor(Math.random() * 10000); // Generate a unique numeric ID
        collections.push(collection); // Add the new collection to the list
        return collection; // Return the added collection
      })
    );
  }

  updateCollectionStatus(id: number, newStatus: string): Observable<Collection> {
    return this.http.get<ApiResponse>(this.apiUrl, { headers: this.headers }).pipe(
      map(response => {
        const collections = response.record.collections;
        const index = collections.findIndex(coll => coll.id === id);
        if (index === -1) {
          throw new Error('Collection not found');
        }
        collections[index].status = newStatus; // Update the status of the collection
        return collections[index]; // Return the updated collection
      })
    );
  }

  deleteCollection(id: number): Observable<void> {
    return this.http.get<ApiResponse>(this.apiUrl, { headers: this.headers }).pipe(
      map(response => {
        const collections = response.record.collections;
        const index = collections.findIndex(coll => coll.id === id);
        if (index === -1) {
          throw new Error('Collection not found');
        }
        collections.splice(index, 1); // Remove the collection from the list
      })
    );
  }
}
