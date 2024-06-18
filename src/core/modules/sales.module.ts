export interface Sale {
  sale_id?: string; // Hacer que sale_id sea opcional
  sale_date: Date;
  store_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
}
