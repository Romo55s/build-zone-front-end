import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as Cookies from 'js-cookie';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://build-zone-back-end.onrender.com';

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
          }
        })
      );
  }

  logout(): void {
    Cookies.remove('token');
    this.router.navigate(['/login']);
  }

  getToken(): string | undefined {
    return Cookies.get('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
