import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service'; // Importa tu servicio de autenticación
import { environment } from '../../../enviroments/enviroments';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private apiUrl = `${environment.API_URL}/store`;

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
  
  getStoreById(storeId: string): Observable<any> {
    const url = `${this.apiUrl}/byid/${storeId}`;
    return this.http
      .get<any>(url, this.getHttpOptions())
      .pipe(catchError(this.handleError<any>('getStoreById')));
  }

  getStoreByName(storeName: string): Observable<any> {
    const url = `${this.apiUrl}/bystore/${storeName}`;
    return this.http
      .get<any>(url, this.getHttpOptions())
      .pipe(catchError(this.handleError<any>('getByStoreName')));
  }

  getAllStores(): Observable<any> {
    const url = `${this.apiUrl}/all`;
    return this.http
      .get<any>(url, this.getHttpOptions())
      .pipe(catchError(this.handleError<any>('getAllStores')));
  }

  storeExists(storeId: string): Observable<any> {
    const url = `${this.apiUrl}/exists/${storeId}`;
    return this.http
      .get<any>(url, this.getHttpOptions())
      .pipe(catchError(this.handleError<any>('storeExists')));
  }

  createStore(store: {
    store_name: string;
    location: string;
  }): Observable<any> {
    const url = `${this.apiUrl}/add`;
    return this.http
      .post<any>(url, store, this.getHttpOptions())
      .pipe(catchError(this.handleError<any>('createStore')));
  }

  updateStore(
    storeId: string,
    store: { store_name: string; location: string }
  ): Observable<any> {
    const url = `${this.apiUrl}/update/${storeId}`;
    return this.http
      .put<any>(url, store, this.getHttpOptions())
      .pipe(catchError(this.handleError<any>('updateStore')));
  }

  deleteStore(storeId: string): Observable<any> {
    const url = `${this.apiUrl}/remove/${storeId}`;
    return this.http
      .delete<any>(url, this.getHttpOptions())
      .pipe(catchError(this.handleError<any>('deleteStore')));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
