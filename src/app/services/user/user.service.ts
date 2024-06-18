import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { of } from 'rxjs';
import { environment } from '../../../enviroments/enviroments';

interface UserAdd {
  store_id: string;
  username: string;
  password: string;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.API_URL}/user`;

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

  addUser(managerData: UserAdd): Observable<any> {
    console.log('Manager:', managerData);
    const url = `${this.apiUrl}/add`;
    console.log(this.getHttpOptions())
    return this.http
      .post<any>(url, managerData, this.getHttpOptions())
      .pipe(catchError(this.handleError<any>('addManager')));
  }

  getUsers(): Observable<any[]> {
    const url = `${this.apiUrl}/allusers`;
    return this.http
      .get<any[]>(url, this.getHttpOptions())
      .pipe(catchError(this.handleError<any[]>('getUsers', [])));
  }

  getUserById(userId: string): Observable<any> {
    const url = `${this.apiUrl}/userById/${userId}`;
    return this.http
      .get<any>(url, this.getHttpOptions())
      .pipe(catchError(this.handleError<any>('getUserById')));
  }
  getUsersByStoreId(storeId: string): Observable<any[]> {
    const url = `${this.apiUrl}/usersByStoreId/${storeId}`;
    return this.http
      .get<any[]>(url, this.getHttpOptions())
      .pipe(catchError(this.handleError<any[]>('getUsersByStoreId', [])));
  }

  updateUser(userId: string, userData: any): Observable<any> {
    const url = `${this.apiUrl}/update/${userId}`;
    return this.http
      .put<any>(url, userData, this.getHttpOptions())
      .pipe(catchError(this.handleError<any>('updateUser')));
  }

  deleteUser(userId: string): Observable<any> {
    const url = `${this.apiUrl}/delete/${userId}`;
    return this.http
      .delete<any>(url, this.getHttpOptions())
      .pipe(catchError(this.handleError<any>('deleteUser')));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // Imprime el error completo en la consola
      console.error(error);

      // Si el error tiene un cuerpo, imprime ese también
      if (error.error) {
        console.error('Error Body:', error.error);
      }

      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
