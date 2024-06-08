import { Component } from '@angular/core';
import { AuthService } from '../../app/services/auth/auth.service';
import Cookies from 'js-cookie';
import { Router } from '@angular/router';
import { User } from '../../core/modules/user.module';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  user: User;

  buildZoneItems = [
    { label: 'build-zone-mty', routerLink: '#' },
    { label: 'build-zone-gdl', routerLink: '#' },
    { label: 'build-zone-ags', routerLink: '#' },
    { label: 'build-zone-cdmx', routerLink: '#' },
  ];

  items = [
    { label: 'Inventory', icon: 'pi pi-folder', items: this.buildZoneItems },
    { label: 'Stores', icon: 'pi pi-shop', items: this.buildZoneItems },
    { label: 'Report', icon: 'pi pi-chart-bar', items: this.buildZoneItems },
    { label: 'Managers', icon: 'pi pi-users', items: this.buildZoneItems },
    { label: 'Log out', icon: 'pi pi-power-off', command: () => this.logout() },
  ];

  constructor(private authService: AuthService, private router: Router) {
    let userCookie = Cookies.get('user');
    try {
      this.user = JSON.parse(userCookie || '{}') as User;
    } catch (error) {
      console.error('Error parsing user cookie:', error);
      this.user = {} as User;
    }
    if (this.user.role === 'admin') {
      this.items = [
        {
          label: 'Dashboard',
          icon: 'pi pi-home',
          command: () => this.dashboardAdmin(),
        },
        {
          label: 'Inventory',
          icon: 'pi pi-folder',
          items: this.buildZoneItems,
        },
        { label: 'Stores', icon: 'pi pi-shop', items: this.buildZoneItems },
        {
          label: 'Report',
          icon: 'pi pi-chart-bar',
          items: this.buildZoneItems,
        },
        { label: 'Managers', icon: 'pi pi-users', items: this.buildZoneItems },
        {
          label: 'Log out',
          icon: 'pi pi-power-off',
          command: () => this.logout(),
        },
      ];
    } else if (this.user.role === 'manager') {
      this.items = [
        {
          label: 'Dashboard',
          icon: 'pi pi-home',
          command: () => this.dashboardManager(),
        },
        {
          label: 'Inventory',
          icon: 'pi pi-folder',
          command: () => this.InventoryManager(),
        },
        {
          label: 'Report',
          icon: 'pi pi-chart-bar',
          command: () => this.ReportManager(),
        },
        {
          label: 'Sales',
          icon: 'pi pi-dollar',
          command: () => this.SalesManager(),
        },
        {
          label: 'Log out',
          icon: 'pi pi-power-off',
          command: () => this.logout(),
        },
      ];
    }
  }

  dashboardManager(): void {
    console.log('Dashboard Manager');
  }

  dashboardAdmin(): void {
    console.log('Dashboard Admin');
  }

  InventoryManager(): void {
    this.router.navigate(['/inventory']);
  }

  ReportManager(): void {
    this.router.navigate(['/report']);
  }

  SalesManager(): void {
    console.log('Sales Manager');
  }

  logout(): void {
    this.authService.logout();
  }
}
