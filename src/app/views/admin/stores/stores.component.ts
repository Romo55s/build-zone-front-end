import { Component, OnInit } from '@angular/core';
import { User } from '../../../../core/modules/user.module';
import { Store } from '../../../../core/modules/stores.module';
import { ActivatedRoute, Router } from '@angular/router';
import Cookies from 'js-cookie';
import { ConfirmationService } from 'primeng/api';
import { AuthService } from '../../../services/auth/auth.service';
import { StoreService } from '../../../services/store/store.service';
import { TostifyService } from '../../../services/tostify/tostify.service';

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrl: './stores.component.scss'
})
export class StoresComponent implements OnInit {
  filteredStores: any[] = [];
  user: User | null = null;
  stores: Store[] = [];
  searchTerm: string = '';
  statuses: any[] = [];
  storeName: string ="";
  store : Store | null = null;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private storeService: StoreService,
    private confirmationService: ConfirmationService,
    private toastifyService: TostifyService
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
          this.loadStores(this.storeName);
        } else {
          this.showStores();
        }
      });    }
    }
    showStores(): void {
      this.storeService.getAllStores().subscribe(
        (data: Store[]) => {
          console.log('Stores data:', data);
          this.stores = data;
          this.filteredStores = data;
        },
        (error) => {
          console.error('Error fetching stores:', error);
        }
      );
    }

    addStore() {
      this.router.navigate(['/addStore']);
    }
    
    updateStore(store: Store) {
      console.log('Updating store:', store.store_id);
      this.router.navigate(['/updateStore', store.store_id]);
    }

    loadStores(storeName: string): void{
      this.storeService.getStoreByName(storeName).subscribe(
        (store: Store) => {
          console.log('Store by name:', store);
          this.stores = [store];
          this.filteredStores = [store];
        },
        (error) => {
          console.error('Error fetching store by name:', error);
        }
      );
    }
    
    deleteStore(store: any): void {
      if (this.user?.role !== 'admin') {
        console.error('Access denied: Only admins can delete stores.');
        return;
      }
    this.storeService.deleteStore(store.store_id).subscribe(
      () => {
        // Eliminar el storeo del array local
        this.stores = this.stores.filter(
          (p) => store.id !== store.id
        );
        this.toastifyService.showSuccess('Store deleted successfully.');
        console.log('store deleted successfully.');
      },
      (error) => {
        this.toastifyService.showError('Error deleting store');
        console.error('Error deleting store:', error);
      }
    );
      }
  
    confirmDeleteStore(store: any){
      this.confirmationService.confirm({
        message: 'Are you sure you want to delete this store?',
        accept: () => {
          this.deleteStore(store);
        }
      });
    }
    filterStores(): void {
      if (this.searchTerm) {
        this.filteredStores = this.stores.filter(store =>
          store.store_name.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      } else {
        this.filteredStores = this.stores;
      }
    }

  }
