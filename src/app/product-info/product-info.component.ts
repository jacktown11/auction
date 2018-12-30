import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product, ProductService, Comment } from '../shared/product.service';

@Component({
  selector: 'app-product-info',
  templateUrl: './product-info.component.html',
  styleUrls: ['./product-info.component.css']
})
export class ProductInfoComponent implements OnInit {
  product: Product;
  comments: Comment[];

  constructor(
    private routerInfo: ActivatedRoute,
    private productService: ProductService
  ) { }

  ngOnInit() {
    let productId = this.routerInfo.snapshot.params['id'];
    this.product = this.productService.getProductById(productId);
    this.comments = this.productService.getCommentsForProduct(productId);
  }

}
