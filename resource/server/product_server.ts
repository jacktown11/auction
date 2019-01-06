import express from 'express';
import { Server } from 'ws';
import path from 'path';

export class Product {
  constructor(
    public id: number,
    public title: string,
    public price: number,
    public rating: number,
    public desc: string,
    public categories: Array<string>
  ) { }
};

export class Comment {
  constructor(
    public id: number,
    public productId: number,
    public timeStamp: string,
    public user: string,
    public rating: number,
    public content: string
  ) { }
};

const PRODUCTS: Product[] = [
  new Product(1, '第一个商品', 1.99, 3.5, '这是一个商品描述。。。。。。。', ['电子产品', '硬件设备']),
  new Product(2, '第二个商品', 6.99, 4.5, '这是一个商品描述。。。。。。。', ['电子产品', '图书']),
  new Product(3, '第三个商品', 8.99, 1, '这是一个商品描述。。。。。。。', ['硬件设备']),
  new Product(4, '第四个商品', 1.99, 5, '这是一个商品描述。。。。。。。', ['电子产品', '图书']),
  new Product(5, '第五个商品', 11.99, 4.5, '这是一个商品描述。。。。。。。', ['硬件设备']),
  new Product(6, '第六个商品', 3.99, 2.5, '这是一个商品描述。。。。。。。', ['电子产品', '硬件设备']),
];

const COMMENTS: Comment[] = [
  new Comment(1, 1, '2018-12-30 16:18:18', 'Tom', 4.5, '挺不错'),
  new Comment(2, 1, '2018-12-30 16:18:18', 'Franck', 4, '挺好'),
  new Comment(3, 1, '2018-12-30 16:18:18', 'Mary', 5, '货真价实'),
  new Comment(4, 2, '2018-12-30 16:18:18', 'Jerry', 3.5, '很不错'),
  new Comment(5, 3, '2018-12-30 16:18:18', 'Bob', 2.5, '挺好的'),
  new Comment(6, 3, '2018-12-30 16:18:18', 'Alice', 4.5, 'very good')
];

const app = express();

app.use('/', express.static(path.resolve(__dirname, '..', 'auction')));

app.get('/api/categories', (req, res) => {
  let categories = [];
  PRODUCTS.forEach((product) => {
    product.categories.forEach((category) => {
      if (categories.indexOf(category) < 0) {
        categories.push(category);
      }
    });
  });
  res.json(categories);
});

app.get('/api/products', (req, res) => {
  let products = PRODUCTS,
    params = req.query;
  if (params.productTitle) {
    products = products.filter((item) => item.title.indexOf(params.productTitle) >= 0);
  }
  if (params.productPrice) {
    products = products.filter((item) => item.price <= params.productPrice);
  }
  if (params.category && params.category !== '-1') {
    products = products.filter((item) => item.categories.indexOf(params.category) >= 0);
  }
  res.json(products);
});

app.get('/api/product/:id', (req, res) => {
  res.json(PRODUCTS.find((product) => product.id === (+req.params.id)));
});

app.get('/api/comment/:id', (req, res) => {
  res.json(COMMENTS.filter((comment) => comment.id === (+req.params.id)));
});

app.listen(8080);
console.log('listening 8080...');


// subscription using webSocket

const subscriptions = new Map<any, number[]>();

const wsServer = new Server({ port: 8081 });

wsServer.on('connection', (webSocket) => {
  webSocket.on('message', (msg: string) => {
    let msgObj = JSON.parse(msg);
    let productIds = subscriptions.get(webSocket) || [];
    if (productIds.indexOf(msgObj.productId) < 0) {
      subscriptions.set(webSocket, [...productIds, msgObj.productId]);
    }
  });
  webSocket.on('close', () => {
    subscriptions.delete(webSocket);
  });
});

const latestBids = new Map<number, number>();

setInterval(() => {
  PRODUCTS.forEach((product) => {
    let currentBid = latestBids.get(product.id) || product.price;
    latestBids.set(product.id, currentBid + Math.random() * 5);
  });
  subscriptions.forEach((productIds: number[], ws) => {
    if (ws.readyState === 1) {
      ws.send(JSON.stringify(productIds.map((pid) => {
        return {
          productId: pid,
          bid: latestBids.get(pid)
        };
      })));
    } else {
      subscriptions.delete(ws);
    }
  });
}, 2000);
