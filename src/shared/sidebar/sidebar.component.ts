import { Component } from '@angular/core';
import { AuthService } from '../../app/services/auth/auth.service'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'] // Corrección en la propiedad styleUrls
})
export class SidebarComponent {
  buildZoneItems = [
    { label: 'build-zone-mty', routerLink: '#' },
    { label: 'build-zone-gdl', routerLink: '#' },
    { label: 'build-zone-ags', routerLink: '#' },
    { label: 'build-zone-cdmx', routerLink: '#' }
  ];

  items = [
    { label: 'Inventory', icon: 'pi pi-folder', items: this.buildZoneItems },
    { label: 'Stores', icon: 'pi pi-shop', items: this.buildZoneItems },
    { label: 'Report', icon: 'pi pi-chart-bar', items: this.buildZoneItems },
    { label: 'Managers', icon: 'pi pi-users', items: this.buildZoneItems },
    { label: 'Log out', icon: 'pi pi-power-off', command: () => this.logout() }
  ];

  showOptions = false;
  
  toggleOptions() {
    this.showOptions = !this.showOptions;
  }

  constructor(private authService: AuthService) {} // Inyecta AuthService

  logout(): void {
    this.authService.logout(); // Llama al método logout de AuthService
  }
}
