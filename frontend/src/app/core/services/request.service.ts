import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BloodRequest, BloodRequestDto } from '../models/request.model';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private apiUrl = '/api/requests';

  constructor(private http: HttpClient) {}

  getAll(): Observable<BloodRequest[]> {
    return this.http.get<BloodRequest[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getMyRequests(): Observable<BloodRequest[]> {
    return this.http.get<BloodRequest[]>(`${this.apiUrl}/my`).pipe(
      catchError(this.handleError)
    );
  }

  create(dto: BloodRequestDto): Observable<BloodRequest> {
    return this.http.post<BloodRequest>(this.apiUrl, dto).pipe(
      catchError(this.handleError)
    );
  }

  updateStatus(id: number, status: 'PENDING' | 'APPROVED' | 'REJECTED'): Observable<BloodRequest> {
    return this.http.put<BloodRequest>(`${this.apiUrl}/${id}/status?status=${status}`, {}).pipe(
      catchError(this.handleError)
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
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
