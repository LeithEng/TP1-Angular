import { Component } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { concatMap, map, scan, startWith, takeWhile } from 'rxjs/operators';
import { Product } from './dto/product.dto';
import { ProductService } from './services/product.service';
import { Settings } from './dto/product-settings.dto';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent {
  products$!: Observable<Product[]>;
  hasMore$!: Observable<boolean>;

  private loadMore$ = new Subject<void>();
  private readonly pageSize = 12;

  constructor(private productService: ProductService) {
    const pageIndex$ = this.loadMore$.pipe(
      startWith(null as unknown as void),
      scan((acc) => acc + 1, -1)
    );

    const accumulation$ = pageIndex$.pipe(
      map(
        (pageIndex) =>
          ({
            limit: this.pageSize,
            skip: pageIndex * this.pageSize,
          } as Settings)
      ),
      concatMap((setting) => this.productService.getProducts(setting)),
      scan(
        (acc, resp) => ({
          products: [...acc.products, ...resp.products],
          total: resp.total,
        }),
        { products: [] as Product[], total: 0 }
      ),
      takeWhile((acc) => acc.products.length < acc.total, true)
    );
    this.products$ = accumulation$.pipe(map((acc) => acc.products));
    this.hasMore$ = accumulation$.pipe(
      map((acc) => acc.products.length < acc.total)
    );
  }

  loadMoreProducts() {
    this.loadMore$.next();
  }
}
