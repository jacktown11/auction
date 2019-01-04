import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [
    new Product(1, '第一个商品', 1.99, 3.5, '这是一个商品描述。。。。。。。', ['电子产品', '硬件设备']),
    new Product(2, '第二个商品', 1.99, 4.5, '这是一个商品描述。。。。。。。', ['电子产品', '图书']),
    new Product(3, '第三个商品', 1.99, 1, '这是一个商品描述。。。。。。。', ['硬件设备']),
    new Product(4, '第四个商品', 1.99, 5, '这是一个商品描述。。。。。。。', ['电子产品', '图书']),
    new Product(5, '第五个商品', 1.99, 4.5, '这是一个商品描述。。。。。。。', ['硬件设备']),
    new Product(6, '第六个商品', 1.99, 2.5, '这是一个商品描述。。。。。。。', ['电子产品', '硬件设备']),
  ];
  private comments: Comment[] = [
    new Comment(1, 1, '2018-12-30 16:18:18', 'Tom', 4.5, '挺不错'),
    new Comment(2, 1, '2018-12-30 16:18:18', 'Franck', 4, '挺好'),
    new Comment(3, 1, '2018-12-30 16:18:18', 'Mary', 5, '货真价实'),
    new Comment(4, 2, '2018-12-30 16:18:18', 'Jerry', 3.5, '很不错'),
    new Comment(5, 3, '2018-12-30 16:18:18', 'Bob', 2.5, '挺好的'),
    new Comment(6, 3, '2018-12-30 16:18:18', 'Alice', 4.5, 'very good')
  ];

  constructor() { }

  getCategories(): string[] {
    return this.products.reduce((prev, cur) => {
      for (let item of cur.categories) {
        if (prev.indexOf(item) < 0) {
          prev.push(item);
        }
      }
      return prev;
    }, []);
  }
  getAllProducts(): Product[] {
    return this.products;
  }

  getProductById(id: number): Product {
    return this.products.find((product: Product) => id == product.id);
  }
  getCommentsForProduct(id: number): Comment[] {
    return this.comments.filter((comment: Comment) => id == comment.productId);
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