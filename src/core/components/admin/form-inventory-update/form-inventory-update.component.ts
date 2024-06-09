import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InventoryService } from '../../../../app/services/inventory/inventory.service';

@Component({
  selector: 'app-form-inventory-update',
  templateUrl: './form-inventory-update.component.html',
  styleUrl: './form-inventory-update.component.scss'
})
export class FormInventoryUpdateComponent {
  updateProductForm!: FormGroup;
  productId!: string;
  storeId!: string;
  product: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private inventoryService: InventoryService
  ) {
    this.updateProductForm = this.fb.group({
      product_name: ['', Validators.required],
      category: ['', Validators.required],
      supplier: ['', Validators.required],
      price: ['', Validators.required],
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

  onSubmit(): void {
    if (this.updateProductForm.valid) {
      this.inventoryService.updateProduct(this.productId, this.updateProductForm.value).subscribe(
        response => {
          console.log('Product updated successfully:', response);
          this.router.navigate(['/inventory', { storeName: this.storeId }]);
        },
        error => {
          console.error('Error updating product:', error);
        }
      );
    }
  }

  cancel(): void{}
}