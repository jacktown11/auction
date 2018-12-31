import { Component, OnInit } from '@angular/core';
import { ProductService, Product } from '../shared/product.service';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  private keywordControl: FormControl = new FormControl();

  private keyword: string;

  private products: Product[];

  constructor(private productService: ProductService) {
    this.keywordControl.valueChanges
      .pipe(debounceTime(500))
      .subscribe((keyword: string) => this.keyword = keyword);
  }

  ngOnInit() {
    this.products = this.productService.getAllProducts();
  }

}
