import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../services/inventory/inventory.service';
import { AuthService } from '../../services/auth/auth.service';
import { User } from '../../../core/modules/user.module';
import Cookies from 'js-cookie';
import { ProductStore } from '../../../core/modules/product.store.module';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from '../../services/store/store.service';
import { Store } from'../../../core/modules/stores.module'
import { ConfirmationService } from 'primeng/api';

interface ReportProduct {
  Product: string;
  Image: string;
  Category: string;
  Supplier: string;
  Price: number;
  Stock: number;
}

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
    private router: Router,
    private storeService: StoreService,
    private confirmationService: ConfirmationService
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
        this.store = store;

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
    console.log('Deleting product:', product.product_id, product.store_id);
    this.inventoryService.deleteProduct(product.product_id, product.store_id).subscribe(
      () => {
        // Eliminar el producto del array local
        this.products = this.products.filter(
          (p) => product.id !== product.id
        );
        console.log('Product deleted successfully.');
      },
      (error) => {
        console.error('Error deleting product:', error);
      }
    );
  }

  confirmDeleteProduct(product : any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this product?',
      accept: () => {
        this.deleteProduct(product);
      }
    });
  }

  updateProduct(product: any){
    if (this.store) {
      this.router.navigate(['/updateProduct', { productId: product.product_id, storeId: product.store_id }]);
    } else {
      console.error('Store not loaded.');
    }
  }

  addProduct():void{
    if (this.store) {
    this.router.navigate(['/addProduct', { storeId: this.store.store_id }]);
  } else {
    console.error('Store not loaded.');
  }
  }
  

  generateReport() {
    const totalStock = this.calculateTotalStock();
  
    // Preparar los datos para el reporte
    const reportData: ReportProduct[] = this.filteredProducts.map((product) => ({
      Product: product.product_name,
      Image: product.image,
      Category: product.category,
      Supplier: product.supplier,
      Price: product.price,
      Stock: product.stock,
    }));
  
    // Agregar el total de productos al final del reporte
    reportData.push({
      Product: 'TOTAL',
      Image: '',
      Category: '',
      Supplier: '',
      Price: 0, // Aquí puedes ajustar el tipo de dato según corresponda
      Stock: totalStock,
    });
  
    // Lógica para generar el reporte (e.g., exportar a CSV, mostrar en pantalla, etc.)
    console.log('Report Data:', reportData);
  
    // Ejemplo: exportar a CSV
    const csvData = this.convertToCSV(reportData);
    this.downloadCSV(csvData);
  }
  
  calculateTotalStock(): number {
    // Calcular el total de productos en inventario sumando el stock de todos los productos
    return this.filteredProducts.reduce((total, product) => total + product.stock, 0);
  }
  
  convertToCSV(data: ReportProduct[]): string {
    const header = ['Product', 'Image', 'Category', 'Supplier', 'Price', 'Stock'];
    const rows = data.map(product => [
      product.Product,
      product.Image,
      product.Category,
      product.Supplier,
      product.Price.toString(), // Asegúrate de convertir a string si es necesario
      product.Stock.toString(), // Asegúrate de convertir a string si es necesario
    ]);
  
    return [header, ...rows].map(row => row.join(',')).join('\n');
  }
  
  downloadCSV(csvData: string) {
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'inventory_report.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
