import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service'; // Importa tu servicio de autenticación
import { of } from 'rxjs';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private apiUrl = `http://localhost:3000/products`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHttpOptions() {
    const token = this.authService.getToken();
    if (!token) {
      return {};
    }
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
      withCredentials: true,
    };
  }

  getByStoreId(store_id: string): Observable<any> {
    const url = `${this.apiUrl}/getByStoreId/${store_id}`;
    return this.http
      .get<any>(url, this.getHttpOptions())
      .pipe(catchError(this.handleError<any>('getByStoreId')));
  }


  addProduct(product: any, imageFile: File): Observable<any> {
    const url = `${this.apiUrl}/add`;
    const formData: FormData = new FormData();
    
    formData.append('store_id', product.store_id);
    formData.append('product_name', product.product_name);
    formData.append('price', product.price.toString());
    formData.append('category', product.category);
    formData.append('stock', product.stock.toString());
    formData.append('supplier', product.supplier);
    formData.append('image', imageFile);
  
    // Crea una nueva instancia de HttpRequest
    const req = new HttpRequest('POST', url, formData, {
      reportProgress: true,
      ...this.getHttpOptions()
    });
  
    return this.http.request<any>(req).pipe(
      catchError(this.handleError<any>('addProduct'))
    );
  }

  updateProduct(productId: string, product: any): Observable<any> {
    const url = `${this.apiUrl}/update/${productId}`;
    return this.http
      .put<any>(url, product, this.getHttpOptions())
      .pipe(catchError(this.handleError<any>('updateProduct')));
  }

  deleteProduct(productId: string): Observable<any> {
    const url = `${this.apiUrl}/delete/${productId}`;
    return this.http
      .delete<any>(url, this.getHttpOptions())
      .pipe(catchError(this.handleError<any>('deleteProduct')));
  }

  getById(productId: string): Observable<any> {
    const url = `${this.apiUrl}/getById/${productId}`;
    return this.http
      .get<any>(url, this.getHttpOptions())
      .pipe(catchError(this.handleError<any>('getById')));
  }

  getAll(): Observable<any> {
    const url = `${this.apiUrl}/all`;
    return this.http
      .get<any>(url, this.getHttpOptions())
      .pipe(catchError(this.handleError<any>('getAll')));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
