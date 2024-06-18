import { Component, OnInit } from '@angular/core';
import { StoreService } from '../../../../app/services/store/store.service';
import { AuthService } from '../../../../app/services/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '../../../modules/stores.module';
import { TostifyService } from '../../../../app/services/tostify/tostify.service';

@Component({
  selector: 'app-form-store-add',
  templateUrl: './form-store-add.component.html',
  styleUrl: './form-store-add.component.scss',
})
export class FormStoreAddComponent {
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
    
  }

  onSubmit(): void {
    this.storeService.createStore(this.store).subscribe(
      (response) => {
        console.log('Store added successfully', response);
        this.tostifyService.showSuccess('Store added successfully');
      },
      (error) => {
        console.error('Error adding Store', error);
        this.tostifyService.showError('Error adding Store', error);
      }
    );
  }
}
