import { Component, OnInit } from '@angular/core';
import { ProductService, Product, ProductSearchParams } from '../shared/product.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  products: Observable<Product[]>;

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.products = this.productService.getAllProducts();
    this.productService.searchEvent
      .subscribe((params: ProductSearchParams) => {
        this.products = this.productService.getFilteredProducts(params);
      });
  }

}
