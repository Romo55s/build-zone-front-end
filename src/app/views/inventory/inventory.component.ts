import { Component } from '@angular/core';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent {
  products = [
    { 
      product: 'Product 1', 
      category: 'Category 1', 
      supplier: 'Supplier 1', 
      price: 100, 
      stock: 50, 
      actions: 'Actions 1' 
    },
    { 
      product: 'Product 2', 
      category: 'Category 2', 
      supplier: 'Supplier 2', 
      price: 200, 
      stock: 30, 
      actions: 'Actions 2' 
    },
    { 
      product: 'Product 3', 
      category: 'Category 3', 
      supplier: 'Supplier 3', 
      price: 150, 
      stock: 20, 
      actions: 'Actions 3' 
    },
  ];
}