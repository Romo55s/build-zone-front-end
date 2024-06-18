import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class SalesService {
  private apiUrl = `http://localhost:3000/sales`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHttpOptions() {
    const token = this.authService.getToken();
    if (!token) {
      return {};
    }
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
      withCredentials: true,
    };
  }

  getById(saleId: string): Observable<any> {
    const url = `${this.apiUrl}/getById/${saleId}`;
    return this.http
      .get<any>(url, this.getHttpOptions())
      .pipe(catchError(this.handleError<any>('getById')));
  }

  getAll(): Observable<any> {
    const url = `${this.apiUrl}/getAll`;
    return this.http
      .get<any>(url, this.getHttpOptions())
      .pipe(catchError(this.handleError<any>('getAll')));
  }

  getByStore(storeId: string): Observable<any> {
    const url = `${this.apiUrl}/getByStore/${storeId}`;
    return this.http
      .get<any>(url, this.getHttpOptions())
      .pipe(catchError(this.handleError<any>('getByStore')));
  }

  addSale(sale: any): Observable<any> {
    const url = `${this.apiUrl}/add`;
    return this.http
      .post<any>(url, sale, this.getHttpOptions())
      .pipe(
        map((response: any) => {
          return { ...response, sale_id: response.sale_id }; // Asegúrate de capturar el sale_id devuelto
        }),
        catchError(this.handleError<any>('addSale'))
      );
  }
  

  deleteSale(saleId: string): Observable<any> {
    const url = `${this.apiUrl}/delete/${saleId}`;
    return this.http
      .delete<any>(url, this.getHttpOptions())
      .pipe(catchError(this.handleError<any>('deleteSale')));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
