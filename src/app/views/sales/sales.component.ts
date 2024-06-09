import { Component, OnInit, ViewChild } from '@angular/core';
import { OverlayPanel } from 'primeng/overlaypanel';
import { InventoryService } from '../../services/inventory/inventory.service';
import { AuthService } from '../../services/auth/auth.service';
import { User } from '../../../core/modules/user.module';
import Cookies from 'js-cookie';
import { ProductStore } from '../../../core/modules/product.store.module';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit {
  @ViewChild('overlay') overlay!: OverlayPanel;
  products: ProductStore[] = [];
  filteredProducts: any[] = [];
  saleProducts: any[] = [];
  user: User | null = null;
  selectedCategory: string | null = null;
  selectedStock: number | null = null;
  searchTerm: string = '';
  categories: any[] = [];
  statuses: any[] = [];

  constructor(
    private inventoryService: InventoryService,
    private authService: AuthService
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
    this.loadInventory();
  }

  loadInventory() {
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

  filterProducts(event?: any, overlay?: OverlayPanel) {
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

      // Mostrar el overlay si se ha realizado una búsqueda
      if (event && overlay) {
        overlay.show(event);
      }
    } else {
      // Si no hay productos cargados, asigna todos los productos a los filtrados
      this.filteredProducts = this.products;
    }
  }

  addProductToSale(product: any) {
    const existingProduct = this.saleProducts.find(p => p.product_id === product.product_id);
    if (existingProduct) {
      existingProduct.units++;
    } else {
      this.saleProducts.push({ ...product, units: 1 });
    }
  }

  removeProductFromSale(product: any) {
    this.saleProducts = this.saleProducts.filter(p => p.product_id !== product.product_id);
  }

  increaseUnits(product: any) {
    const saleProduct = this.saleProducts.find(p => p.product_id === product.product_id);
    if (saleProduct) {
      saleProduct.units++;
    }
  }

  decreaseUnits(product: any) {
    const saleProduct = this.saleProducts.find(p => p.product_id === product.product_id);
    if (saleProduct && saleProduct.units > 1) {
      saleProduct.units--;
    } else {
      this.removeProductFromSale(product);
    }
  }

  getTotalAmount(): number {
    return this.saleProducts.reduce((total, product) => total + product.price * product.units, 0);
  }

  finalizeSale() {
    // Lógica para finalizar la venta
    console.log('Finalizing sale with products:', this.saleProducts);
    // Aquí puedes agregar la lógica para guardar la venta en el servidor o realizar otras acciones necesarias
  }

  cancelSale() {
    // Lógica para cancelar la venta
    this.saleProducts = [];
  }
}
