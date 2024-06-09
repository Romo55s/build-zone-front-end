import { Component } from '@angular/core';
import { ProductStore } from '../../../modules/product.store.module';
import { InventoryService } from '../../../../app/services/inventory/inventory.service';
import { Router, ActivatedRoute } from '@angular/router';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-form-inventory-add',
  templateUrl: './form-inventory-add.component.html',
  styleUrl: './form-inventory-add.component.scss'
})
export class FormInventoryAddComponent {
  storeId: any;
  storeName: string = "";
  product: ProductStore = {
    product_id: '',
    store_id: '',  // Asegúrate de asignar el ID de la tienda correspondiente
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
) {
  this.route.paramMap.subscribe(params => {
    this.storeId = params.get('storeId'); // Obtener el ID de la tienda de los parámetros de la URL
    console.log('Store ID:', this.storeId); // Verificar el ID de la tienda en la consola
    // Asignar el storeId identificado al producto
    this.product.store_id = this.storeId; 
});
}

onSubmit() {
  console.log(this.product);
  this.inventoryService.addProduct(this.storeId, this.product).subscribe(
  (response) => {
    console.log('Product added successfully', response);
    this.router.navigate(['/inventory', { storeName: this.storeName }]);
  },
  (error) => {
    console.error('Error adding product', error);
  }
);
}
}
