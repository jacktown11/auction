import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product, ProductService, Comment } from '../shared/product.service';
import { WebSocketService } from '../web-socket.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-product-info',
  templateUrl: './product-info.component.html',
  styleUrls: ['./product-info.component.css']
})
export class ProductInfoComponent implements OnInit {
  product: Product;
  comments: Comment[];

  isWatched: boolean = false;
  latestBid: number;
  subscription: Subscription;

  newRating: number = 5;
  newComment: string = '';
  nextCommentId: number = 0;
  isHideNewComment: boolean = true;

  constructor(
    private routerInfo: ActivatedRoute,
    private productService: ProductService,
    private socketService: WebSocketService
  ) { }

  ngOnInit() {
    let productId = this.routerInfo.snapshot.params['id'];
    this.productService.getProductById(productId)
      .subscribe((data) => {
        this.product = data;
        this.latestBid = this.product.price;
      });
    this.productService.getCommentsForProduct(productId)
      .subscribe((data) => {
        this.comments = data;
        let maxId = this.comments.reduce((prev, cur) => Math.max(prev, cur.id), 0);
        this.nextCommentId = maxId + 1;
      });
  }

  toggleWatch() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.isWatched = false;
      this.subscription = null;
    } else {
      this.isWatched = true;
      this.subscription = this.socketService.createObservableSocket('ws://localhost:8081', this.product.id)
        .subscribe((data) => {
          let dataArr = JSON.parse(data);
          this.latestBid = dataArr.find((item) => item.productId = this.product.id).bid;
        });
    }
  }

  submitComment(event: any): void {
    // unshift new comment
    let comment: Comment = new Comment(this.nextCommentId++, this.product.id, DateFormat.format(new Date(), 'yyyy-MM-dd hh:mm:ss'), 'someone', this.newRating, this.newComment);
    this.comments.unshift(comment);

    // recalculate the average rating of the current product
    let sum = this.comments.reduce((prev, cur) => prev + cur.rating, 0);
    this.product.rating = sum / this.comments.length;

    // reset input field and hide
    this.newRating = 5;
    this.newComment = '';
    this.isHideNewComment = true;
  }
}

export class DateFormat {
  static format(d: Date, fmt: string) {
    var o = {
      "M+": d.getMonth() + 1, //月份
      "d+": d.getDate(), //日
      "h+": d.getHours(), //小时
      "m+": d.getMinutes(), //分
      "s+": d.getSeconds(), //秒
      "q+": Math.floor((d.getMonth() + 3) / 3), //季度
      "S": d.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (d.getFullYear() + "")
        .substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
      if (new RegExp("(" + k + ")").test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k])
          .substr(("" + o[k]).length)));
      }
    }
    return fmt;
  }
}