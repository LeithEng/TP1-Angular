import { Component, computed, signal } from '@angular/core';
import { Product } from './dto/product.dto';
import { ProductApiResponse } from './dto/product-api-response.dto';
import { resource } from '../core/resource';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class ProductsComponent {
  private page = signal(0);
  private readonly pageSize = 12;
  productsResource = resource<
    ProductApiResponse,
    { limit: number; skip: number }
  >({
    request: () => ({
      limit: this.pageSize,
      skip: this.page() * this.pageSize,
    }),
    loader: async ({ request, abortSignal, previous }) => {
      const params = new URLSearchParams({
        limit: String(request.limit),
        skip: String(request.skip),
      });
      const url = `/products?${params.toString()}`;
      const resp = await fetch(url, { signal: abortSignal });
      const json = (await resp.json()) as ProductApiResponse;
      if (!previous || !previous.products) return json;
      return {
        ...json,
        products: [...previous.products, ...json.products],
      } as ProductApiResponse;
    },
    defaultValue: { products: [], limit: this.pageSize, skip: 0, total: 0 },
  });

  products = computed(() => this.productsResource.value().products);
  hasMore = computed(
    () =>
      this.productsResource.value().products.length <
      this.productsResource.value().total
  );
  loading = computed(
    () =>
      this.productsResource.value().total === 0 &&
      this.productsResource.value().products.length === 0
  );

  loadMoreProducts() {
    this.page.update((p) => p + 1);
    this.productsResource.trigger();
  }

  constructor() {}
}
