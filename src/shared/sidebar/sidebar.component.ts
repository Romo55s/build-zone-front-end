import { Component, OnInit} from '@angular/core';
import { AuthService } from '../../app/services/auth/auth.service';
import Cookies from 'js-cookie';
import { Router } from '@angular/router';
import { User } from '../../core/modules/user.module';
import { StoreService } from '../../app/services/store/store.service';
import { Store } from '../../core/modules/stores.module';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit{
  user: User;

  buildZoneItems = [
    { label: '' },
  ];

  items: any = [];

  constructor(private authService: AuthService, private router: Router, private storeService: StoreService) {
    let userCookie = Cookies.get('user');
    

    try {
      this.user = JSON.parse(userCookie || '{}') as User;
    } catch (error) {
      console.error('Error parsing user cookie:', error);
      this.user = {} as User;
    }
    if (this.user.role === 'manager') {
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

  ngOnInit(): void {
    this.storeService.getAllStores().subscribe(
      (stores) => {
        this.buildZoneItems = stores.map((store: Store) => ({ label: store.store_name }));
        console.log('Stores:', this.buildZoneItems);
  
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
              items: this.buildZoneItems.map((item) => ({
                ...item,
                command: () => this.navigate('inventory', item.label),
              })),
              command: () => this.navigate('inventory', ''),
            },
            {
              label: 'Report',
              icon: 'pi pi-chart-bar',
              items: this.buildZoneItems.map((item) => ({
                ...item,
                command: () => this.navigate('report', item.label),
              })),
              command: () => this.navigate('report', ''),
            },
            {
              label: 'Managers',
              icon: 'pi pi-users',
              items: this.buildZoneItems.map((item) => ({
                ...item,
                command: () => this.navigate('managers', item.label),
              })),
              command: () => this.navigate('managers', ''),
            },
            {
              label: 'Log out',
              icon: 'pi pi-power-off',
              command: () => this.logout(),
            },
          ];
        }
        // similar code for other roles
      },
      (error) => {
        console.error('Error fetching stores:', error);
      }
    );
  }
  
  navigate(page: string, storeName: string): void {
    console.log(`Navigating to ${page} for store: ${storeName}`);
    this.router.navigate([`/${page}`, { storeName: storeName }]);
  }

  //Admin

  dashboardAdmin(): void {
    this.router.navigate(['/dashboard']);
    console.log('Dashboard Admin');
  }

  // Manager

  dashboardManager(): void {
    this.router.navigate(['/dashboard']);
  }

  InventoryManager(): void {
    this.router.navigate(['/inventory']);
  }

  ReportManager(): void {
    this.router.navigate(['/report']);
  }

  SalesManager(): void {
    this.router.navigate(['/sales']);
  }

  logout(): void {
    this.authService.logout();
  }
}
