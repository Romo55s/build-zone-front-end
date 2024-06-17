// login.component.ts
import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { TostifyService } from '../../services/tostify/tostify.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';


  constructor(
    @Inject(AuthService) private authService: AuthService,
    private router: Router,
    private tostyfiService: TostifyService
  ) {}

  login(): void {
    if (this.username.trim() === '' || this.password.trim() === '') {
      this.tostyfiService.showError('Username and Password are required');
      console.log('Username and Password are required');
      return;
    }

    this.authService.login(this.username, this.password).subscribe({
      next: (response: any) => {
        this.router.navigate(['/dashboard']);
        this.tostyfiService.showSuccess('Login successful!');
      },
      error: (err: any) => {
        console.log(this.username);
        console.log(this.password);
        console.error(err);
        this.tostyfiService.showError(err.message);
      }
    });
  }
}
