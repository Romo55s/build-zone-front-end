export interface ProductStore {
  product_id: string;
  store_id: string;
  product_name: string;
  category: string;
  price: number;
  stock: number;
  image: File;
  supplier: string;
}
