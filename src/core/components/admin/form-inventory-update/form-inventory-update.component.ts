import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InventoryService } from '../../../../app/services/inventory/inventory.service';
import { TostifyService } from '../../../../app/services/tostify/tostify.service';

@Component({
  selector: 'app-form-inventory-update',
  templateUrl: './form-inventory-update.component.html',
  styleUrls: ['./form-inventory-update.component.scss']
})
export class FormInventoryUpdateComponent {
  updateProductForm!: FormGroup;
  productId!: string;
  storeId!: string;
  product: any;
  selectedFile: File | null = null; // Agregado para manejar la imagen seleccionada
  storeName: any;
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private inventoryService: InventoryService,
    private tostifyService: TostifyService
  ) {
    this.updateProductForm = this.fb.group({
      store_id: ['', Validators.required],
      product_name: ['', Validators.required],
      category: ['', Validators.required],
      supplier: ['', Validators.required],
      price: ['', [Validators.required, Validators.pattern(/^\d*\.?\d*$/)]], // Solo permite números y un punto decimal opcional
      stock: ['', Validators.required],
      image: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.productId = params['productId'];
      this.storeId = params['storeId'];
      this.loadProduct();
    });
  }

  loadProduct(): void {
    this.inventoryService.getById(this.productId).subscribe(
      data => {
        this.product = data;
        this.updateProductForm.patchValue(this.product);
      },
      error => {
        console.error('Error fetching product:', error);
      }
    );
  }

  onFileSelected(event?: any): void { // Agregado para manejar la selección de la imagen
    if(event && event.files && event.files.length > 0){
      this.selectedFile = event.files[0];
    }else{
      console.log('No file selected');
    }
  }

  onSubmit(): void {
    if (this.updateProductForm.valid) {
      const updatedProduct = { ...this.updateProductForm.value, store_id: this.storeId };
  
      // Convertir el precio a una cadena de texto
      updatedProduct.price = updatedProduct.price.toString();

      // Agregar la imagen seleccionada al producto actualizado
      if (this.selectedFile) {
        updatedProduct.image = this.selectedFile;
      }
  
      // Enviamos los datos actualizados al servicio de inventario
      this.inventoryService.updateProduct(this.productId, updatedProduct).subscribe(
        response => {
          console.log('Product updated successfully:', response);
          this.tostifyService.showSuccess('Product updated successfully');
        },
        error => {
          console.error('Error updating product:', error);
          this.tostifyService.showError('Error updating product:', error);
        }
      );
    } else {
      // Si el formulario no es válido, mostrar un mensaje de error
      console.error('El formulario no es válido.');
    }
  }

  cancel(): void {
    this.router.navigate(['/inventory', { storeId: this.storeId }]);
  }

  showProductInfo(): void {
  }
}