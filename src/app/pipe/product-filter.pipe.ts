import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../shared/product.service';

@Pipe({
  name: 'productFilter'
})
export class ProductFilterPipe implements PipeTransform {

  transform(products: Product[], key?: string, keyword?: string): any {
    console.log(key, keyword);
    if (!(key && keyword)) return products;
    return products.filter((product: Product) => {
      return product[key] && product[key].indexOf(keyword) >= 0;
    });
  }

}
