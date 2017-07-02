import { Component, OnDestroy, OnInit, Output, EventEmitter, OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { ConfirmationService } from 'primeng/primeng';

import { Product } from '../product';
import { ProductService } from '../product.service';
import { LikeButtonComponent } from '../like-button/like-button.component';
import { SellerProductsCollectionComponent } from '../seller-products-collection/seller-products-collection.component';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnDestroy, OnInit {

  // @Output() onOtherProductClickedInDetail = new EventEmitter<number>();

  product: Product;
  private _productSubscription: Subscription;
  private _likes: Array<any> = [];
  sellerProductsCollection: SellerProductsCollectionComponent;

  constructor(
    private _productService: ProductService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _confirmationService: ConfirmationService) { }

  /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|
  | Broken White Path                                                |
  |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

  _recuperarLikesWebStorage(): void {
    // Recoge la información de los 'Me gusta' persistida en WebStorage.
    if (JSON.parse(localStorage.getItem('infoLikes')) !== null) {
      this._likes = JSON.parse(localStorage.getItem('infoLikes'));
    }
  }

  ngOnInit(): void {
    this._recuperarLikesWebStorage();
    this._route.data.forEach((data: { product: Product }) => this.product = data.product);
    window.scrollTo(0, 0);
  }

  ngOnDestroy(): void {
    if (this._productSubscription !== undefined) {
      this._productSubscription.unsubscribe();
    }
  }

  private _buyProduct(): void {
    this._productSubscription = this._productService
      .buyProduct(this.product.id)
      .subscribe(() => this._showPurchaseConfirmation())
  }

  private _showPurchaseConfirmation(): void {
    this._confirmationService.confirm({
      rejectVisible: false,
      message: 'Producto comprado. ¡Enhorabuena!',
      accept: () => this._router.navigate(['/product'])
    });
  }

  showPurchaseWarning(): void {
    this._confirmationService.confirm({
      message: `Vas a comprar ${this.product.name}. ¿Estás seguro?`,
      accept: () => this._buyProduct()
    });
  }

  goBack(): void {
    window.history.back();
  }

  _devuelvePosicionProductoEnEstructuraLikes(): number {
    for (var index = 0; index < this._likes.length; index++) {
      var element = this._likes[index];

      if (element[0] === this.product.id) {
        return index;
      }

      // Si se ha recorrido toda la estructura '_likes' y no se encuentra el producto se añade a la estructura
      if (index === this._likes.length - 1) {
        return -1;
      }
    }

    return -1;
  }

  _meGustaClicado(): void {
    // Si el navegador soporta WebStorage
    if (typeof (Storage) !== undefined) {
      if (this._likes.length === 0) {
        this._likes.push([this.product.id, true]);
      } else {
        const posProducto: number = this._devuelvePosicionProductoEnEstructuraLikes();

        if (posProducto < 0) {
          this._likes.push([this.product.id, true]);
        } else {
          let valorLike = this._likes[posProducto][1];
          valorLike = !valorLike;
          this._likes[posProducto][1] = valorLike;
        }
      }

      localStorage.setItem("infoLikes", JSON.stringify(this._likes));
      // localStorage.clear();
    }
  }

  _dameLiteral(): string {
    // Si en '_likes' no encuentra el producto devuelve el literal 'Todavía no me Gusta'.
    // Si en '_likes' encuentra el producto devuelve literal en función de si tiene 'true' ('Me gusta') o 'false' ('Todavía no me Gusta').
    const posProducto: number = this._devuelvePosicionProductoEnEstructuraLikes();

    if (posProducto < 0) {
      return 'Todavía no me gusta';
    } else {
      if (this._likes[posProducto][1]) {
        return 'Me gusta';
      } else {
        return 'Todavía no me gusta';
      }
    }
  }

  _dameSellerId(): number {
    return this.product.seller.id;
  }

  _dameProductId(): number {
    return this.product.id;
  }

  clicadoOtroProductoEnVenta(id: number): void {
    // this.onOtherProductClickedInDetail.emit();
    this._router.navigate(['products', id]);
  }

}