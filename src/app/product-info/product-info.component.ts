import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-info',
  templateUrl: './product-info.component.html',
  styleUrls: ['./product-info.component.css']
})
export class ProductInfoComponent implements OnInit {
  private title: string;

  constructor(private routerInfo: ActivatedRoute) { }

  ngOnInit() {
    this.title = this.routerInfo.snapshot.params['title'];
  }

}
