import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { of } from 'rxjs';

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
  private apiUrl = `http://localhost:3000/user`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

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
    const url = `${this.apiUrl}/add`; // Endpoint para agregar un manager
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
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
