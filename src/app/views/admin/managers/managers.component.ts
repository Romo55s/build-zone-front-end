import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Cookies from 'js-cookie';
import { ConfirmationService } from 'primeng/api';
import { Store } from '../../../../core/modules/stores.module';
import { User } from '../../../../core/modules/user.module';
import { AuthService } from '../../../services/auth/auth.service';
import { StoreService } from '../../../services/store/store.service';
import { UserService } from '../../../services/user/user.service';
import { TostifyService } from '../../../services/tostify/tostify.service';

@Component({
  selector: 'app-managers',
  templateUrl: './managers.component.html',
  styleUrl: './managers.component.scss'
})
export class ManagersComponent implements OnInit {
  filteredManagers: any[] = [];
  user: User | null = null;
  users: User[] = [];
  searchTerm: string = '';
  statuses: any[] = [];
  storeName: string ="";
  store : Store | null = null;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private storeService: StoreService,
    private confirmationService: ConfirmationService,
    private toastyService: TostifyService
  ) {
    let userCookie = Cookies.get('user');
    try {
      this.user = JSON.parse(userCookie || '{}') as User;
    } catch (error) {
      console.error('Error parsing user cookie:', error);
      this.user = {} as User;
    }
    console.log('User:', this.user);
  }

  ngOnInit() {
    if (this.user?.role === 'admin') {
      this.route.params.subscribe(params => {
        this.storeName = params['storeName'];
        if (this.storeName) {
          this.loadManagers(this.storeName);
        } else {
          this.showUsers();
        }
      });    }
  }

  loadManagers(storeName: string): void{
    this.storeService.getStoreByName(storeName).subscribe(
      (store) => {
        console.log('Store by name:', store);
        const storeId = store.store_id;
        this.store = store;

        this.userService.getUsersByStoreId(storeId).subscribe(
          (data) => {
            console.log('Managers data:', data);
            this.users = data;
            this.filterManager();
          },
          (error) => {
            console.error('Error fetching managers:', error);
          }
        );
      },
      (error) => {
        console.error('Error fetching store by name:', error);
      }
    );
  }

  showUsers(): void {
    this.userService.getUsers().subscribe(
      (data: User[]) => {
        console.log('Users data:', data);
        this.users = data;
        this.filteredManagers = data;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  addManager():void{
    if (this.store) {
      this.router.navigate(['/addManager', { storeId: this.store.store_id }]);
    } else {
      console.error('Store not loaded.');
    }
  }
  updateManager(manager: any ):void{
    if (this.store) {
      this.router.navigate(['/updateManager', { storeId: this.store.store_id, userId: manager.user_id }]);
    } else {
      console.error('Store not loaded.');
    }
  }
  
  filterManager():void{
    if (this.searchTerm) {
      this.filteredManagers = this.users.filter(user =>
        user.username.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredManagers = this.users;
    }
  }
  deleteManager(manager: any):void{
    if (this.user?.role !== 'admin') {
      console.error('Access denied: Only admins can delete managers.');
      return;
    }
    console.log('Deleting manager:', manager.user_id, manager.store_id);
    this.userService.deleteUser(manager.user_id).subscribe(
      () => {
        // Eliminar el managero del array local
        this.users = this.users.filter(
          (p) => manager.id !== manager.id
        );
        this.toastyService.showSuccess('Manager deleted successfully.');
        console.log('manager deleted successfully.');
      },
      (error) => {
        this.toastyService.showError('Error deleting manager.');
        console.error('Error deleting manager:', error);
      }
    );
  }
  confirmDeleteManager(manager: any):void{
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this product?',
      accept: () => {
        this.deleteManager(manager);
      }
    });
  }
}
