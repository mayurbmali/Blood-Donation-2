import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DonationHistory, DonationDto } from '../models/donation.model';

@Injectable({
  providedIn: 'root'
})
export class DonationService {
  private apiUrl = '/api/donations';

  constructor(private http: HttpClient) {}

  getAll(): Observable<DonationHistory[]> {
    return this.http.get<DonationHistory[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getByDonor(donorId: number): Observable<DonationHistory[]> {
    return this.http.get<DonationHistory[]>(`${this.apiUrl}/donor/${donorId}`).pipe(
      catchError(this.handleError)
    );
  }

  add(dto: DonationDto): Observable<DonationHistory> {
    return this.http.post<DonationHistory>(this.apiUrl, dto).pipe(
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
