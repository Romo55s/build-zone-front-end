import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service'; // Importa tu servicio de autenticación
import { of } from 'rxjs';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private apiUrl = `http://localhost:3000/products`;

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

  getByStoreId(store_id: string): Observable<any> {
    const url = `${this.apiUrl}/getByStoreId/${store_id}`;
    return this.http
      .get<any>(url, this.getHttpOptions())
      .pipe(catchError(this.handleError<any>('getByStoreId')));
  }


  addProduct(storeId: string, product: any): Observable<any> {
    const url = `${this.apiUrl}/add`;
    const body = { storeId, product };
    return this.http
      .post<any>(url, body, this.getHttpOptions())
      .pipe(catchError(this.handleError<any>('addProduct')));
  }

  updateProduct(productId: string, product: any): Observable<any> {
    const url = `${this.apiUrl}/update/${productId}`;
    return this.http
      .put<any>(url, product, this.getHttpOptions())
      .pipe(catchError(this.handleError<any>('updateProduct')));
  }

  deleteProduct(productId: string): Observable<any> {
    const url = `${this.apiUrl}/delete/${productId}`;
    return this.http
      .delete<any>(url, this.getHttpOptions())
      .pipe(catchError(this.handleError<any>('deleteProduct')));
  }

  getById(productId: string): Observable<any> {
    const url = `${this.apiUrl}/getById/${productId}`;
    return this.http
      .get<any>(url, this.getHttpOptions())
      .pipe(catchError(this.handleError<any>('getById')));
  }

  getAll(): Observable<any> {
    const url = `${this.apiUrl}/all`;
    return this.http
      .get<any>(url, this.getHttpOptions())
      .pipe(catchError(this.handleError<any>('getAll')));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
