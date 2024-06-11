import { Component } from '@angular/core';
import { ProductStore } from '../../../modules/product.store.module';
import { InventoryService } from '../../../../app/services/inventory/inventory.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-form-inventory-add',
  templateUrl: './form-inventory-add.component.html',
  styleUrl: './form-inventory-add.component.scss'
})
export class FormInventoryAddComponent {
  storeId: any;
  storeName: any;
  product: ProductStore = {
    product_id: '',
    store_id: '', 
    product_name: '',
    category: '',
    price: 0,
    stock: 0,
    image: '',
    supplier: ''
}

constructor(
  private inventoryService: InventoryService, 
  private router: Router,
  private route: ActivatedRoute
) {}

ngOnInit(): void {
  this.route.paramMap.subscribe(params => {
    this.storeId = params.get('storeId');
    this.storeName = params.get('storeName');
    if (this.storeId) {
      this.product.store_id = this.storeId;
    } else {
      console.error('Store ID is null');
    }
  });
}

onSubmit(): void {
  if (!this.storeId) {
    console.error('Store ID is null, cannot submit the form');
    return;
  }

  console.log(this.product);
  
  // Asegúrate de asignar el store_id al producto
  this.product.store_id = this.storeId;

  this.inventoryService.addProduct(this.storeId,this.product).subscribe(
    (response) => {
      console.log('Product added successfully', response);
    },
    (error) => {
      console.error('Error adding product', error);
    }
  );
}

}
