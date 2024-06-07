import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  constructor(private authService: AuthService) {} // Inyecta AuthService

  logout(): void {
    this.authService.logout(); // Llama al método logout de AuthService
  }
}