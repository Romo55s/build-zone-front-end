import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../services/inventory/inventory.service';
import { AuthService } from '../../services/auth/auth.service';
import { User } from '../../../core/modules/user.module';
import Cookies from 'js-cookie';
import { ProductStore } from '../../../core/modules/product.store.module';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from '../../services/store/store.service';
import { Store } from'../../../core/modules/stores.module'

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
})
export class InventoryComponent implements OnInit {
  products: ProductStore[] = [];
  filteredProducts: any[] = [];
  user: User | null = null;
  selectedCategory: string | null = null;
  selectedStock: number | null = null;
  searchTerm: string = '';
  categories: any[] = [];
  statuses: any[] = [];
  storeName: string ="";
  tienda: any[] = [];
  store : Store | null = null;

  constructor(
    private inventoryService: InventoryService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private storeService: StoreService,
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
  if(this.user?.role === 'admin'){
     // Obtener el valor del parámetro de la URL
    this.route.params.subscribe(params => {
      this.storeName = params['storeName'];
      // Cargar el inventario de la tienda específica
      if (this.storeName) {
        this.loadInventory(this.storeName);
      } else {
        this.allInventary();
      }
    });
  } else if(this.user?.role === 'manager'){
    this.showInventory();
  }
  }

  showInventory(): void{
    if (this.user && this.user.store_id) {
      this.inventoryService.getByStoreId(this.user.store_id).subscribe(
        (data) => {
          console.log('Inventory data:', data);
          this.products = data;
          // Llena las categorías y los estados con los datos únicos de los productos
          this.categories = [
            ...new Set(this.products.map((product) => product.category)),
          ];
          this.statuses = [
            ...new Set(this.products.map((product) => product.stock)),
          ];
          // Filtrar productos si es necesario
          this.filterProducts();
        },
        (error) => {
          console.error('Error fetching inventory:', error);
        }
      );
    } else {
      console.error('Store ID not found in user data.');
    }
  }
  
  loadInventory(storeName: string): void {
    // Llamar al servicio de inventario para cargar los datos de la tienda específica
    this.storeService.getStoreByName(storeName).subscribe(
      (store) => {
        // Obtener el ID de la tienda
        console.log("Store by name", store);
        const storeId = store.store_id;
        this.inventoryService.getByStoreId(storeId).subscribe(
          (data) => {
            console.log('Inventory data:', data);
            this.products = data;
            // Llena las categorías y los estados con los datos únicos de los productos
            this.categories = [
              ...new Set(this.products.map((product) => product.category)),
            ];
            this.statuses = [
              ...new Set(this.products.map((product) => product.stock)),
            ];
            // Filtrar productos si es necesario
            this.filterProducts();
          },
          (error) => {
            console.error('Error fetching inventory:', error);
          }
        );
      },
      (error) => {
        console.error('Error fetching store by name:', error);
      }
    );
  }
  
  allInventary(): void{
    // Llamar al servicio para cargar todos los productos
  this.inventoryService.getAll().subscribe(
    (data) => {
      console.log('All inventory data:', data);
      this.products = data;
      // Llena las categorías y los estados con los datos únicos de los productos
      this.categories = [
        ...new Set(this.products.map((product) => product.category)),
      ];
      this.statuses = [
        ...new Set(this.products.map((product) => product.stock)),
      ];
      // No es necesario aplicar ningún filtro
      this.filteredProducts = this.products;
    },
    (error) => {
      console.error('Error fetching all inventory:', error);
    }
  );

  }
  
  filterProducts() {
    // Realiza el filtrado solo si hay productos cargados
    if (this.products.length > 0) {
      // Realiza el filtrado en función de los criterios seleccionados
      this.filteredProducts = this.products.filter((product) => {
        const matchesCategory =
          !this.selectedCategory || product.category === this.selectedCategory;
        const matchesStock =
          !this.selectedStock || product.stock === this.selectedStock;
        const matchesSearchTerm =
          !this.searchTerm ||
          product.product_name
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase());
        return matchesCategory && matchesStock && matchesSearchTerm;
      });
    } else {
      // Si no hay productos cargados, asigna todos los productos a los filtrados
      this.filteredProducts = this.products;
    }
  }

  deleteProduct(product: any) {
    if (this.user?.role !== 'admin') {
      console.error('Access denied: Only admins can delete products.');
      return;
    }

    this.inventoryService.deleteProduct(product.id).subscribe(
      () => {
        // Eliminar el producto del array local
        this.products = this.products.filter(
          (p) => p.product_id !== product.product_id
        );
        console.log('Product deleted successfully.');
      },
      (error) => {
        console.error('Error deleting product:', error);
      }
    );
  }

  updateProduct(product: any){

  }

  addProduct():void{
  }
}
