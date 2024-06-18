import { Component, OnInit } from '@angular/core';
import { SalesService } from '../../services/sales/sales.service';
import { AuthService } from '../../services/auth/auth.service';
import { InventoryService } from '../../services/inventory/inventory.service';
import { Sale } from '../../../core/modules/sales.module';
import Cookies from 'js-cookie';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ProductStore } from '../../../core/modules/product.store.module';
import { Store } from'../../../core/modules/stores.module'
import { Router } from 'express';
import { StoreService } from '../../services/store/store.service';
import { ActivatedRoute } from '@angular/router';

interface SalesReport extends Sale {
  total_sales_amount: number;
}

@Component({
  selector: 'app-sales-report',
  templateUrl: './sales-report.component.html',
  styleUrls: ['./sales-report.component.scss'],
})
export class SalesReportComponent implements OnInit {
  sales: Sale[] = [];
  filteredSales: Sale[] = [];
  totalSalesAmount: number = 0;
  user: any;
  products: ProductStore[] = [];
  selectedCategory: string | null = null;
  selectedProduct: string | null = null;
  searchTerm: string = '';
  categories: any[] = [];
  statuses: any[] = [];
  filteredProducts: any[] = [];
  storeName: string ="";
  tienda: any[] = [];
  store : Store | null = null;

  constructor(
    private salesService: SalesService,
    private authService: AuthService,
    private inventoryService: InventoryService,
    private storeService: StoreService,
    private route: ActivatedRoute,

  ) {
    let userCookie = Cookies.get('user');
    try {
      this.user = JSON.parse(userCookie || '{}');
    } catch (error) {
      console.error('Error parsing user cookie:', error);
      this.user = {};
    }
  }

  ngOnInit() {
    if(this.user?.role === 'admin'){
      // Obtener el valor del parámetro de la URL
      this.route.params.subscribe(params => {
        this.storeName = params['storeName'];
       // Cargar el inventario de la tienda específica
        if (this.storeName) {
          this.loadSales(this.storeName);
        } else {
          this.allSales();
        }
      });
    } else if(this.user?.role === 'manager'){
      this.showSales();
    }
  }

  showSales(){
    if (this.user && this.user.store_id) {
      forkJoin({
        sales: this.salesService.getByStore(this.user.store_id).pipe(
          catchError((error) => {
            console.error('Error fetching sales:', error);
            return of(null);
          })
        ),
        inventory: this.inventoryService.getByStoreId(this.user.store_id).pipe(
          catchError((error) => {
            console.error('Error fetching inventory:', error);
            return of(null);
          })
        ),
      }).subscribe(({ sales, inventory }) => {
        if (sales) {
          this.sales = sales;
          this.filterSales();
        }
        if (inventory) {
          this.products = inventory;
          this.categories = [
            ...new Set(this.products.map((product) => product.category)),
          ];
          this.statuses = [
            ...new Set(this.products.map((product) => product.stock)),
          ];
          this.filterProducts();
        }
      });
    } else {
      console.error('Store ID not found in user data.');
    }
  }


  allSales(): void {
      this.salesService.getAll().subscribe(
        (sales) => {
          console.log('All sales data:', sales);
          // Asignar los datos de ventas sin filtrar
          this.sales = sales;
          // Filtrar las ventas si es necesario
          this.filterSales();
        },
        (error) => {
          console.error('Error fetching all sales:', error);
        }
      );
  }
  
  loadSales(storeName: string): void {
    // Llamar al servicio de tienda para obtener el ID de la tienda basada en el nombre de la tienda
    this.storeService.getStoreByName(storeName).subscribe(
      (store) => {
        // Obtener el ID de la tienda
        console.log("Store by name", store);
        const storeId = store.store_id;
  
        // Usar el ID de la tienda para obtener las ventas e inventario
        forkJoin({
          sales: this.salesService.getByStore(storeId).pipe(
            catchError((error) => {
              console.error('Error fetching sales:', error);
              return of(null);
            })
          ),
          inventory: this.inventoryService.getByStoreId(storeId).pipe(
            catchError((error) => {
              console.error('Error fetching inventory:', error);
              return of(null);
            })
          ),
        }).subscribe(({ sales, inventory }) => {
          if (sales) {
            this.sales = sales;
            this.filterSales();
          }
          if (inventory) {
            this.products = inventory;
            this.categories = [
              ...new Set(this.products.map((product) => product.category)),
            ];
            this.statuses = [
              ...new Set(this.products.map((product) => product.stock)),
            ];
            this.filterProducts();
          }
        });
      },
      (error) => {
        console.error('Error fetching store by name:', error);
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
        const matchesSearchTerm =
          !this.searchTerm ||
          product.product_name
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase());
        return matchesCategory && matchesSearchTerm;
      });
    } else {
      // Si no hay productos cargados, asigna todos los productos a los filtrados
      this.filteredProducts = this.products;
    }
  }

  filterSales() {
    if (this.sales.length > 0) {
      this.filteredSales = this.sales.filter((sale) => {
        const matchesStore =
          !this.selectedCategory || sale.store_id === this.selectedCategory;
        const matchesProduct =
          !this.selectedProduct || sale.product_id === this.selectedProduct;
        const matchesSearchTerm =
          !this.searchTerm ||
          sale.product_id.toLowerCase().includes(this.searchTerm.toLowerCase());
        return matchesStore && matchesProduct && matchesSearchTerm;
      });
    } else {
      this.filteredSales = this.sales;
    }
    this.calculateTotalSalesAmount(); // Actualiza el total después de filtrar

  }


  calculateTotalSalesAmount(): any {
    this.totalSalesAmount = this.filteredSales.reduce((total, sale) => total + Number(sale.total_amount), 0);
      this.totalSalesAmount = parseFloat(this.totalSalesAmount.toFixed(2));
      return this.totalSalesAmount;
  }

  generateReport() {
    const reportData: SalesReport[] = this.filteredSales.map(sale => ({
      ...sale,
      total_sales_amount: sale.total_amount // Aquí, total_sales_amount es igual al total de esa venta específica.
    }));

    console.log('Report Data:', reportData);

    const csvData = this.convertToCSV(reportData);
    this.downloadCSV(csvData);
  }

  convertToCSV(data: SalesReport[]): string {
    const total = this.calculateTotalSalesAmount();
    const header = ['Sale ID', 'Date', 'Store', 'Product', 'Quantity', 'Unit Price', 'Total Amount'];
    const rows = data.map(sale => [
      sale.sale_id,
      sale.sale_date,
      sale.store_id,
      sale.product_id,
      sale.quantity,
      sale.unit_price,
      sale.total_amount,
    ]);

    // Agregar fila total al final
    const totalRow = ['TOTAL', '', '', '', '', '', total];

    return [header, ...rows, totalRow].map(row => row.join(',')).join('\n');
  }

  downloadCSV(csvData: string) {
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'sales_report.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  getProductById(productId: string): ProductStore | undefined {
    return this.products.find(product => product.product_id === productId);
  }

  
}
