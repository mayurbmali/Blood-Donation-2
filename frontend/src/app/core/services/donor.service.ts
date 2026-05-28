import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Donor, DonorDto, AdminCreateDonorRequest } from '../models/donor.model';

@Injectable({
  providedIn: 'root'
})
export class DonorService {
  private apiUrl = '/api/donors';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Donor[]> {
    return this.http.get<Donor[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getById(id: number): Observable<Donor> {
    return this.http.get<Donor>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  getByUserId(userId: number): Observable<Donor> {
    return this.http.get<Donor>(`${this.apiUrl}/user/${userId}`).pipe(
      catchError(this.handleError)
    );
  }

  getMyProfile(): Observable<Donor> {
    return this.http.get<Donor>(`${this.apiUrl}/me`).pipe(
      catchError(this.handleError)
    );
  }

  getByBloodGroup(bg: string): Observable<Donor[]> {
    return this.http.get<Donor[]>(`${this.apiUrl}/bloodgroup/${bg}`).pipe(
      catchError(this.handleError)
    );
  }

  create(dto: DonorDto, userId: number): Observable<Donor> {
    return this.http.post<Donor>(`${this.apiUrl}?userId=${userId}`, dto).pipe(
      catchError(this.handleError)
    );
  }

  adminCreateDonor(request: AdminCreateDonorRequest): Observable<Donor> {
    return this.http.post<Donor>(`${this.apiUrl}/admin/create`, request).pipe(
      catchError(this.handleError)
    );
  }

  createMyProfile(dto: DonorDto): Observable<Donor> {
    return this.http.post<Donor>(`${this.apiUrl}/me`, dto).pipe(
      catchError(this.handleError)
    );
  }

  update(id: number, dto: DonorDto): Observable<Donor> {
    return this.http.put<Donor>(`${this.apiUrl}/${id}`, dto).pipe(
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
