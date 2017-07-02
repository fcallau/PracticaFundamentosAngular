import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/switchMap';

import { Product } from '../product';
import { ProductFilter } from '../product-filter';
import { ProductService } from '../product.service';
import { ProductFilterPipe } from '../product-filter.pipe';

@Component({
  selector: 'app-seller-products-collection',
  templateUrl: './seller-products-collection.component.html',
  styleUrls: ['./seller-products-collection.component.css']
})
export class SellerProductsCollectionComponent implements OnInit, OnChanges {

  @Input() sellerId: number;
  @Input() productIdToExclude: number;
  @Output() onOtherProductClicked = new EventEmitter<number>();

  products: Product[];
  private _filterStream$: Subject<ProductFilter> = new Subject;
  productFilterParam: ProductFilter = {};

  constructor(
    private _productService: ProductService,
    private _router: Router,
    private _productFilterPipe: ProductFilterPipe) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['productIdToExclude'] && changes['productIdToExclude']['currentValue']) {
      this.productFilterParam.sellerId = this.sellerId.toString();
      this.productFilterParam.excludeProductId = this.productIdToExclude.toString();
      this.filterCollection(this.productFilterParam);
    }
  }

  ngOnInit(): void {
    this.productFilterParam.sellerId = this.sellerId.toString();
    this.productFilterParam.excludeProductId = this.productIdToExclude.toString();

    this._filterStream$
      .switchMap((filter: ProductFilter) => this._productService.getProducts(filter))
      .subscribe((products: Product[]) => this.products = this._productFilterPipe.transform(products, this.productFilterParam));
    this.filterCollection(null);
  }

  ngOnDestroy(): void {
    this._filterStream$.unsubscribe();
  }

  filterCollection(filter: ProductFilter): void {
    if (filter) {
      this.productFilterParam = filter;
    }
    this._filterStream$.next(filter);
  }

  detalleProducto(producto: Product): void {
    // this._router.navigate(['products', producto.id]);
    this.onOtherProductClicked.emit(producto.id);
  }

}
