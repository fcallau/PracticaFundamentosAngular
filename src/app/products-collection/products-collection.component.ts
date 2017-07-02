import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/switchMap';

import { Product } from '../product';
import { ProductFilter } from '../product-filter';
import { ProductService } from '../product.service';
import { ProductFilterPipe } from '../product-filter.pipe';

// Se inyecta como dependencia el Router de la app
import { AppRoutingModule } from '../app-routing.module';

@Component({
  selector: 'app-products-collection',
  templateUrl: './products-collection.component.html',
  styleUrls: ['./products-collection.component.css']
})
export class ProductsCollectionComponent implements OnDestroy, OnInit {

  products: Product[];
  private _filterStream$: Subject<ProductFilter> = new Subject;
  productFilterParam: ProductFilter;

  constructor(
    private _productService: ProductService,
    private _router: Router,
    private _productFilterPipe: ProductFilterPipe) { }

  /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|
  | Red Wine Path (con Pipes)                                        |
  |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

  ngOnInit(): void {
    // Aquí recuperamos el filtro
    if (JSON.parse(sessionStorage.getItem('lastFilter')) !== null) {
      this.productFilterParam = JSON.parse(sessionStorage.getItem('lastFilter'));      
    }

    this._filterStream$
      .switchMap((filter: ProductFilter) => this._productService.getProducts(filter))
      .subscribe((products: Product[]) => this.products = this._productFilterPipe.transform(products, this.productFilterParam));
    this.filterCollection(null);
  }

  ngOnDestroy(): void {
    this._filterStream$.unsubscribe();
  }

  filterCollection(filter: ProductFilter): void {
    // Cuando clico en 'Buscar' guardo en SessionStorage el filtro
    sessionStorage.setItem("lastFilter", JSON.stringify(filter));

    if (filter) {
      this.productFilterParam = filter;
    }
    this._filterStream$.next(filter);
  }

  /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|
  | Green Path                                                       |
  |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|
  | Maneja el evento del componente ProductComponent que indica la   |
  | selección de un producto y navega a la dirección correspondiente.|
  | Recuerda que para hacer esto necesitas inyectar como dependencia |
  | el Router de la app. La ruta a navegar es '/products', pasando   |
  | como parámetro el identificador del producto.                    |
  |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

  detalleProducto(producto: Product): void {
    this._router.navigate(['products', producto.id]);
  }

  recuperarFiltro(): ProductFilter {
    return this.productFilterParam;
  }

}
