import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import Cookies from 'js-cookie';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, { username, password })
      .pipe(
        tap(response => {
          if (response && response.token) {
            Cookies.set('token', response.token);
            Cookies.set('username', response.username);
            Cookies.set('role', response.role);
          }
        })
      );
  }

  logout(): void {
    Cookies.remove('token');
    Cookies.remove('username');
    Cookies.remove('role');
    console.log('Logged out');
    this.router.navigate(['/login']);
  }

  getToken(): string | undefined {
    return Cookies.get('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
