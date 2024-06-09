import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { SalesService } from '../../services/sales/sales.service';
import { User } from '../../../core/modules/user.module';
import Cookies from 'js-cookie';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  topSalesProduct: any = {};
  lessSalesProduct: any = {};
  SaleStatus: any = {};
  storeSales: any = {};
  user: User = {} as User;
  options: any;

  constructor(private authService: AuthService, private salesService: SalesService) {}

  ngOnInit(): void {
    const userCookie = Cookies.get('user');
    try {
      this.user = JSON.parse(userCookie || '{}') as User;
    } catch (error) {
      console.error('Error parsing user cookie:', error);
      this.user = {} as User;
    }

    if (this.user.store_id) {
      this.salesService.getByStore(this.user.store_id).subscribe(
        (data) => {
          // Agrupación y procesamiento de los datos para topSalesProduct
          const groupedByProduct: any = data.reduce((acc: any, sale: any) => {
            acc[sale.product_id] = [...(acc[sale.product_id] || []), sale];
            return acc;
          }, {});
          
          const topSalesProductData: any[] = (Object.values(groupedByProduct) as any[]).map((sales: any[]) => ({
            product_id: sales[0].product_id,
            total_quantity: sales.reduce((acc, cur) => acc + cur.quantity, 0)
          })).sort((a, b) => b.total_quantity - a.total_quantity);

          const lessSalesProductData: any[] = (Object.values(groupedByProduct) as any[]).map((sales: any[]) => ({
            product_id: sales[0].product_id,
            total_quantity: sales.reduce((acc, cur) => acc + cur.quantity, 0)
          })).sort((a, b) => a.total_quantity - b.total_quantity); // Ordenar de menor a mayor

          const labels = topSalesProductData.map(product => product.product_id);
          const dataValues = topSalesProductData.map(product => product.total_quantity);
          const backgroundColors = topSalesProductData.map((product, index) => index === 0 ? '#FF6384' : '#36A2EB'); // Resalta el más vendido

          const topProduct = topSalesProductData[0];
          const lessProduct = lessSalesProductData[0];
          
          this.topSalesProduct = {
            labels: labels,
            datasets: [
              {
                label: 'Sales Quantity by Product',
                data: dataValues,
                backgroundColor: backgroundColors
              }
            ]
          };

          this.lessSalesProduct = {
            labels: labels,
            datasets: [
              {
                label: 'Sales Quantity by Product',
                data: dataValues,
                backgroundColor: backgroundColors
              }
            ]
          };

           // Agregar opciones del gráfico con un título que indique el producto con menos ventas
           this.options = {
            title: {
              display: true,
              text: `Less Sales Product: ${lessProduct.product_id} with ${lessProduct.total_quantity} units sold`,
              fontSize: 16
            }
          };

          // Agregar opciones del gráfico con un título que indique el producto más vendido
          this.options = {
            title: {
              display: true,
              text: `Top Sales Product: ${topProduct.product_id} with ${topProduct.total_quantity} units sold`,
              fontSize: 16
            }
          };

          console.log('Top sales product:', this.topSalesProduct);

          // Agrupación y procesamiento de los datos para SaleStatus
          const groupedByDate = data.reduce((acc: any, sale: any) => {
            acc[sale.sale_date] = [...(acc[sale.sale_date] || []), sale];
            return acc;
          }, {});

          const saleStatusData = Object.keys(groupedByDate).map((date) => ({
            sale_date: date,
            total_sales: groupedByDate[date].reduce((acc: any, cur: any) => acc + Number(cur.total_amount), 0)
          }));

          this.SaleStatus = {
            labels: saleStatusData.map(sale => sale.sale_date),
            datasets: [
              {
                label: 'Total Sales',
                backgroundColor: '#42A5F5',
                data: saleStatusData.map(sale => sale.total_sales)
              }
            ]
          };

          console.log('Sale status:', this.SaleStatus);
        },
        (error) => {
          console.error('Error fetching sales data:', error);
        }
      );

      // Obtener las ventas por tienda
      this.salesService.getAll().subscribe(
        (data: any) => {
          const groupedByStore: any = data.reduce((acc: any, sale: any) => {
            acc[sale.store_id] = (acc[sale.store_id] || 0) + Number(sale.total_amount);
            return acc;
          }, {});

          const storeSalesData = Object.keys(groupedByStore).map((store_id) => ({
            store_id: store_id,
            total_sales: groupedByStore[store_id]
          })).sort((a, b) => b.total_sales - a.total_sales);
          
          const storeLabels = storeSalesData.map(store => store.store_id);
          const storeDataValues = storeSalesData.map(store => store.total_sales);
          const storeBackgroundColors = storeSalesData.map((store, index) => index === 0 ? '#FF6384' : '#36A2EB'); // Resalta la tienda con más ventas

          const topStore = storeSalesData[0];

          this.storeSales = {
            labels: storeLabels,
            datasets: [
              {
                label: 'Sales by Store',
                data: storeDataValues,
                backgroundColor: storeBackgroundColors
              }
            ]
          };

          console.log('Store sales:', this.storeSales);
        },
        (error: any) => {
          console.error('Error fetching store sales data:', error);
        }
      );
    }
  }
}
