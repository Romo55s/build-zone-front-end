import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service'; // Importa tu servicio de autenticación


@Injectable({
  providedIn: 'root'
})
export class StoreService {

  private apiUrl = `http://localhost:3000/store`;


  constructor(
    private http: HttpClient, 
    private authService: AuthService) { }


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

getStoreByName(storeName: string): Observable<any> {
  const url = `${this.apiUrl}/bystore/${storeName}`;
  return this.http
    .get<any>(url, this.getHttpOptions())
    .pipe(catchError(this.handleError<any>('getByStoreName')));
}

private handleError<T>(operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {
    console.error(`${operation} failed: ${error.message}`);
    return of(result as T);
  };
}
}
