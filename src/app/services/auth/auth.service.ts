import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import Cookies from 'js-cookie';
import { environment } from '../../../enviroments/enviroments';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.API_URL;

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
            Cookies.set('user', JSON.stringify(response.user));
          }
        })
      );
  }

  isValidUUID(uuid: string): boolean {
    const regex = new RegExp(
      '^[0-9a-fA-F]{8}\\-[0-9a-fA-F]{4}\\-4[0-9a-fA-F]{3}\\-[89abAB][0-9a-fA-F]{3}\\-[0-9a-fA-F]{12}$'
    );
    return regex.test(uuid);
  }

  logout(): void {
    Cookies.remove('token');
    Cookies.remove('user');
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
