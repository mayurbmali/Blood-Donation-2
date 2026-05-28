import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BloodInventory, InventoryDto } from '../models/inventory.model';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private apiUrl = '/api/inventory';

  constructor(private http: HttpClient) {}

  getAll(): Observable<BloodInventory[]> {
    return this.http.get<BloodInventory[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  update(dto: InventoryDto): Observable<BloodInventory> {
    return this.http.put<BloodInventory>(this.apiUrl, dto).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred!';
    if (error.error && typeof error.error === 'object') {
      errorMessage = error.error.message || JSON.stringify(error.error);
    } else if (error.message) {
      errorMessage = error.message;
    }
    return throwError(() => errorMessage);
  }
}
