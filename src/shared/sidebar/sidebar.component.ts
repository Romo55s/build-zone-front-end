import { Component } from '@angular/core';
import { AuthService } from '../../app/services/auth/auth.service'; // Asegúrate de que la ruta sea correcta


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  options = ['build-zone-mty', 'build-zone-gdl', 'build-zone-ags', 'build-zone-cdmx']; // Tus opciones aquí
  
    showOptions = false;
  
    toggleOptions() {
      this.showOptions = !this.showOptions;
    }

    constructor(private authService: AuthService) {} // Inyecta AuthService

    logout(): void {
      console.log(this.authService.isAuthenticated());
      this.authService.logout(); // Llama al método logout de AuthService
    }
}
