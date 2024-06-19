import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { SalesService } from '../../services/sales/sales.service';
import { User } from '../../../core/modules/user.module';
import Cookies from 'js-cookie';
import { InventoryService } from '../../services/inventory/inventory.service';
import { StoreService } from '../../services/store/store.service';
import { Sale } from '../../../core/modules/sales.module';
import { ProductStore } from '../../../core/modules/product.store.module';
import { TopSalesProduct } from '../../../core/modules/top.sales.module';
import { Store } from '../../../core/modules/stores.module';
import { StoreSales } from '../../../core/modules/sales.store.module';
import { format } from 'date-fns';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  topSalesProduct: any = {};
  lessSalesProduct: any = {};
  SaleStatus: any = {};
  storeSales: any = {};
  user: User = {} as User;
  options: any;
  optionsLessSalesProduct: any;
  optionsTopSalesProduct: any;

  constructor(
    private authService: AuthService,
    private salesService: SalesService,
    private inventoryService: InventoryService,
    private storeService: StoreService
  ) {}

  ngOnInit(): void {
    const userCookie = Cookies.get('user');
    try {
      this.user = JSON.parse(userCookie || '{}') as User;
    } catch (error) {
      console.error('Error parsing user cookie:', error);
      this.user = {} as User;
    }

    if (this.user.role === 'admin') {
      this.getAdminData();
    } else if (this.user.store_id) {
      this.getManagerData(this.user.store_id);
    }
  }

  getManagerData(store_id: string) {
    if (store_id) {
      this.salesService.getByStore(store_id).subscribe(
        (data) => {
          // Agrupación y procesamiento de los datos para topSalesProduct
          const groupedByProduct: any = data.reduce((acc: any, sale: any) => {
            acc[sale.product_id] = [...(acc[sale.product_id] || []), sale];
            return acc;
          }, {});

          const productPromises = Object.keys(groupedByProduct).map(
            (product_id) =>
              this.inventoryService.getById(product_id).toPromise()
          );
          Promise.all(productPromises).then((products: ProductStore[]) => {
            const topSalesProductData: TopSalesProduct[] = products
              .map((product) => ({
                product_name: product.product_name,
                total_quantity: groupedByProduct[product.product_id].reduce(
                  (acc: any, cur: any) => acc + cur.quantity,
                  0
                ),
              }))
              .sort((a: any, b: any) => b.total_quantity - a.total_quantity);

            const lessSalesProductData: TopSalesProduct[] = products
              .map((product) => ({
                product_name: product.product_name,
                total_quantity: groupedByProduct[product.product_id].reduce(
                  (acc: any, cur: any) => acc + cur.quantity,
                  0
                ),
              }))
              .sort((a: any, b: any) => a.total_quantity - b.total_quantity);

            const labels = topSalesProductData.map(
              (product) => product.product_name
            );
            const dataValues = topSalesProductData.map(
              (product) => product.total_quantity
            );
            const backgroundColors = topSalesProductData.map((product, index) =>
              this.generateRandomColor()
            ); // Resalta el más vendido

            const topProduct = topSalesProductData[0];
            const lessProduct = lessSalesProductData[0];

            this.topSalesProduct = {
              labels: labels,
              datasets: [
                {
                  label: 'Sales Quantity by Product',
                  data: dataValues,
                  backgroundColor: backgroundColors,
                },
              ],
            };

            this.lessSalesProduct = {
              labels: labels,
              datasets: [
                {
                  label: 'Sales Quantity by Product',
                  data: dataValues,
                  backgroundColor: backgroundColors,
                },
              ],
            };

            // Agregar opciones del gráfico con un título que indique el producto con menos ventas
            this.optionsLessSalesProduct = {
              plugins: {
                title: {
                  display: true,
                  text: `Less Sales Product: ${lessProduct.product_name} with ${lessProduct.total_quantity} units sold`,
                  fontSize: 16,
                },
              },
            };

            this.optionsTopSalesProduct = {
              plugins: {
                title: {
                  display: true,
                  text: `Top Sales Product: ${topProduct.product_name} with ${topProduct.total_quantity} units sold`,
                  fontSize: 16,
                },
              },
            };

            console.log('Top sales product:', this.topSalesProduct);

            // Agrupación y procesamiento de los datos para SaleStatus
            const groupedByDate = data.reduce((acc: any, sale: any) => {
              acc[sale.sale_date] = [...(acc[sale.sale_date] || []), sale];
              return acc;
            }, {});

            const saleStatusData = Object.keys(groupedByDate).map((date) => {
              const salesOnDate = groupedByDate[date];
              const product = products.find(
                (product) => product.product_id === salesOnDate[0].product_id
              );
              return {
                sale_date: format(new Date(date), 'MM/dd'), // Formatea la fecha a MM/dd
                product_name: product ? product.product_name : 'Unknown', // Asume que todos los productos vendidos en la misma fecha son iguales
                total_sales: salesOnDate.reduce(
                  (acc: any, cur: any) => acc + Number(cur.total_amount),
                  0
                ),
              };
            });

            this.SaleStatus = {
              labels: saleStatusData.map((sale) => sale.sale_date),
              datasets: [
                {
                  label: 'Total Sales',
                  backgroundColor: backgroundColors,
                  data: saleStatusData.map((sale) => sale.total_sales),
                },
              ],
            };

            console.log('Sale status:', this.SaleStatus);
          });
        },
        (error) => {
          console.error('Error fetching sales data:', error);
        }
      );

      this.salesService.getAll().subscribe(
        (data: any) => {
          const groupedByStore: any = data.reduce((acc: any, sale: any) => {
            acc[sale.store_id] =
              (acc[sale.store_id] || 0) + Number(sale.total_amount);
            return acc;
          }, {});

          const storePromises = Object.keys(groupedByStore).map((store_id) =>
            this.storeService.getStoreById(store_id).toPromise()
          );

          Promise.all(storePromises).then((stores: StoreSales[]) => {
            const storeSalesData: StoreSales[] = stores
              .map((store, index) => ({
                store_id: store.store_id,
                store_name: store.store_name,
                total_quantity: groupedByStore[store.store_id],
              }))
              .sort((a, b) => b.total_quantity - a.total_quantity);

            const storeLabels = storeSalesData.map((store) => store.store_name);
            const storeDataValues = storeSalesData.map(
              (store) => store.total_quantity
            );
            const storeBackgroundColors = storeSalesData.map((store, index) =>
              this.generateRandomColor()
            ); // Resalta la tienda con más ventas

            const topStore = storeSalesData[0];

            this.storeSales = {
              labels: storeLabels,
              datasets: [
                {
                  label: 'Sales by Store',
                  data: storeDataValues,
                  backgroundColor: storeBackgroundColors,
                },
              ],
            };

            console.log('Store sales:', this.storeSales);
          });
        },
        (error: any) => {
          console.error('Error fetching store sales data:', error);
        }
      );
    }
  }

  getAdminData() {
    this.salesService.getAll().subscribe((data) => {
      // Agrupación y procesamiento de los datos para topSalesProduct
      const groupedByProduct: any = data.reduce((acc: any, sale: any) => {
        acc[sale.product_id] = [...(acc[sale.product_id] || []), sale];
        return acc;
      }, {});

      const productPromises = Object.keys(groupedByProduct).map((product_id) =>
        this.inventoryService.getById(product_id).toPromise()
      );
      Promise.all(productPromises).then(
        (products: ProductStore[]) => {
          const topSalesProductData: TopSalesProduct[] = products
            .map((product) => ({
              product_name: product.product_name,
              total_quantity: groupedByProduct[product.product_id].reduce(
                (acc: any, cur: any) => acc + cur.quantity,
                0
              ),
            }))
            .sort((a: any, b: any) => b.total_quantity - a.total_quantity);

          const lessSalesProductData: TopSalesProduct[] = products
            .map((product) => ({
              product_name: product.product_name,
              total_quantity: groupedByProduct[product.product_id].reduce(
                (acc: any, cur: any) => acc + cur.quantity,
                0
              ),
            }))
            .sort((a: any, b: any) => a.total_quantity - b.total_quantity);

          const labels = topSalesProductData.map(
            (product) => product.product_name
          );
          const dataValues = topSalesProductData.map(
            (product) => product.total_quantity
          );
          const backgroundColors = topSalesProductData.map((product, index) =>
            this.generateRandomColor()
          );

          const topProduct = topSalesProductData[0];
          const lessProduct = lessSalesProductData[0];

          this.topSalesProduct = {
            labels: labels,
            datasets: [
              {
                label: 'Sales Quantity by Product',
                data: dataValues,
                backgroundColor: backgroundColors,
              },
            ],
          };

          this.lessSalesProduct = {
            labels: labels,
            datasets: [
              {
                label: 'Sales Quantity by Product',
                data: dataValues,
                backgroundColor: backgroundColors,
              },
            ],
          };

          // Agregar opciones del gráfico con un título que indique el producto con menos ventas
          this.optionsLessSalesProduct = {
            plugins: {
              title: {
                display: true,
                text: `Less Sales Product: ${lessProduct.product_name} with ${lessProduct.total_quantity} units sold`,
                fontSize: 16,
              },
            },
          };

          this.optionsTopSalesProduct = {
            plugins: {
              title: {
                display: true,
                text: `Top Sales Product: ${topProduct.product_name} with ${topProduct.total_quantity} units sold`,
                fontSize: 16,
              },
            },
          };

          // Agrupación y procesamiento de los datos para SaleStatus
          const groupedByDate = data.reduce((acc: any, sale: any) => {
            acc[sale.sale_date] = [...(acc[sale.sale_date] || []), sale];
            return acc;
          }, {});

          const saleStatusData = Object.keys(groupedByDate).map((date) => {
            const salesOnDate = groupedByDate[date];
            const product = products.find(
              (product) => product.product_id === salesOnDate[0].product_id
            );
            return {
              sale_date: format(new Date(date), 'MM/dd'), // Formatea la fecha a MM/dd
              product_name: product ? product.product_name : 'Unknown', // Asume que todos los productos vendidos en la misma fecha son iguales
              total_sales: salesOnDate.reduce(
                (acc: any, cur: any) => acc + Number(cur.total_amount),
                0
              ),
            };
          });
          this.SaleStatus = {
            labels: saleStatusData.map(
              (sale) => `${sale.product_name} (${sale.sale_date})`
            ), // Muestra el nombre del producto y la fecha
            datasets: [
              {
                label: 'Total Sales',
                backgroundColor: backgroundColors,
                data: saleStatusData.map((sale) => sale.total_sales),
              },
            ],
          };

          console.log('Sale status:', this.SaleStatus);
        },
        (error) => {
          console.error('Error fetching sales data:', error);
        }
      );
    });

    this.salesService.getAll().subscribe(
      (data: any) => {
        const groupedByStore: any = data.reduce((acc: any, sale: any) => {
          acc[sale.store_id] =
            (acc[sale.store_id] || 0) + Number(sale.total_amount);
          return acc;
        }, {});

        const storePromises = Object.keys(groupedByStore).map((store_id) =>
          this.storeService.getStoreById(store_id).toPromise()
        );

        Promise.all(storePromises).then((stores: StoreSales[]) => {
          const storeSalesData: StoreSales[] = stores
            .map((store, index) => ({
              store_id: store.store_id,
              store_name: store.store_name,
              total_quantity: groupedByStore[store.store_id],
            }))
            .sort((a, b) => b.total_quantity - a.total_quantity);

          const storeLabels = storeSalesData.map((store) => store.store_name);
          const storeDataValues = storeSalesData.map(
            (store) => store.total_quantity
          );
          const storeBackgroundColors = storeSalesData.map((store, index) =>
            this.generateRandomColor()
          );

          const topStore = storeSalesData[0];

          this.storeSales = {
            labels: storeLabels,
            datasets: [
              {
                label: 'Sales by Store',
                data: storeDataValues,
                backgroundColor: storeBackgroundColors,
              },
            ],
          };
        });
      },
      (error: any) => {
        console.error('Error fetching store sales data:', error);
      }
    );
  }
  generateRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}
