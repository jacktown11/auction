import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  searchEvent: EventEmitter<ProductSearchParams> = new EventEmitter();

  constructor(private http: HttpClient) { }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>('/api/categories');
  }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>('/api/products');
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>('/api/product/' + id);
  }
  getCommentsForProduct(id: number): Observable<Comment[]> {
    return this.http.get<Comment[]>('/api/comment/' + id);
  }
  doSearch(params: ProductSearchParams): void {
    this.searchEvent.emit(params);
  }
  getFilteredProducts(filter: ProductSearchParams): Observable<Product[]> {
    let params: HttpParams = new HttpParams();
    for (let key in filter) {
      if (filter[key]) {
        params = params.set(key, filter[key]);
      }
    }
    return this.http.get<Product[]>('/api/products', { params: params });
  }
}

export class Product {
  constructor(
    public id: number,
    public title: string,
    public price: number,
    public rating: number,
    public desc: string,
    public categories: Array<string>
  ) { }
}

export class Comment {
  constructor(
    public id: number,
    public productId: number,
    public timeStamp: string,
    public user: string,
    public rating: number,
    public content: string
  ) { }
}

export class ProductSearchParams {
  constructor(
    public productTitle: string,
    public productPrice: number,
    public category: string
  ) { }
}