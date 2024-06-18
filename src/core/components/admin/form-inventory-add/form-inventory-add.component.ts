import { Component, OnInit } from '@angular/core';
import { ProductStore } from '../../../modules/product.store.module';
import { InventoryService } from '../../../../app/services/inventory/inventory.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../app/services/auth/auth.service';
import { ProductStoreAdd } from '../../../modules/product.store.add.module';
import { TostifyService } from '../../../../app/services/tostify/tostify.service';

@Component({
  selector: 'app-form-inventory-add',
  templateUrl: './form-inventory-add.component.html',
  styleUrls: ['./form-inventory-add.component.scss']
})
export class FormInventoryAddComponent implements OnInit {
  storeId: any;
  storeName: any;
  selectedFile: File | null = null;
  
  product: ProductStoreAdd = {
    store_id: '', 
    product_name: '',
    category: '',
    price: 0,
    stock: 0,
    image: new File([], ''),
    supplier: ''
  };

  constructor(
    private inventoryService: InventoryService, 
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private tostifyService: TostifyService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.storeId = params.get('storeId');
      
      if (this.storeId && this.authService.isValidUUID(this.storeId)) {
        this.product.store_id = this.storeId;
      } else {
        console.error('Store ID is null or not a valid UUID');
      }
    });
  }


  onFileSelected(event?: any): void {
    if(event && event.files && event.files.length > 0){
      const file = event.files[0];
      this.product.image = file;
    }else{
      console.log('No file selected');
    }
  }

  onSubmit(): void {
    if (!this.storeId) {
      console.error('Store ID is null, cannot submit the form');
      return;
    }
    this.product.store_id = this.storeId;
    this.inventoryService.addProduct(this.product).subscribe(
      (response) => {
        console.log('Product added successfully', response);
        this.tostifyService.showSuccess('Product added successfully');
      },
      (error) => {
        console.error('Error adding product', error);
        this.tostifyService.showError('Error adding product', error);
      }
    );
  }
}