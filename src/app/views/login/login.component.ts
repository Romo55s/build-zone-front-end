import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';

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
    private messageService: MessageService
  ) {}

  login(): void {
    if (this.username.trim() === '' || this.password.trim() === '') {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Username and Password are required' });
      return;
    }

    this.authService.login(this.username, this.password).subscribe({
      next: (response: any) => { // Añade el tipo 'any' al parámetro 'response'
        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => { // Añade el tipo 'any' al parámetro 'err'
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message });
      }
    });
  }
}