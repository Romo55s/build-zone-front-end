import { Component, OnInit } from '@angular/core';
import { StoreService } from '../../../../app/services/store/store.service';
import { AuthService } from '../../../../app/services/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '../../../modules/stores.module';
import { TostifyService } from '../../../../app/services/tostify/tostify.service';

@Component({
  selector: 'app-form-store-update',
  templateUrl: './form-store-update.component.html',
  styleUrl: './form-store-update.component.scss',
})
export class FormStoreUpdateComponent implements OnInit {
  storeId: any;
  storeName: any;
  selectedFile: File | null = null;

  store: Store = {
    store_id: '',
    location: '',
    store_name: '',
  };

  constructor(
    private storeService: StoreService, // Inyecta el servicio UserService
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private tostifyService: TostifyService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.storeId = params['id'];
      this.loadStore(this.storeId);
    })
  }

  loadStore(storeId: string): void {
    this.storeService.getStoreById(storeId).subscribe(
      (store: Store) => {
        this.store = store;
      },
      (error) => {
        console.error('Error fetching store by id:', error);
      }
    );
  }

  onSubmit(): void {
    this.storeService.updateStore(this.storeId, this.store).subscribe(
      (response) => {
        console.log('Store updated successfully', response);
        this.tostifyService.showSuccess('Store updated successfully'); // Muestra un mensaje de éxito

      },
      (error) => {
        console.error('Error updating Store', error);
        this.tostifyService.showError('Error updating Store', error); // Muestra un mensaje de éxito
      }
    );
  }
}