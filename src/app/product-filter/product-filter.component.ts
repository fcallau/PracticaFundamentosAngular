import { Component, EventEmitter, OnInit, OnDestroy, Input, Output } from '@angular/core';
import { Subscription } from 'rxjs/Rx';

import { Category } from '../category';
import { CategoryService } from '../category.service';
import { ProductFilter } from '../product-filter';

@Component({
  selector: 'app-product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.css']
})
export class ProductFilterComponent implements OnDestroy, OnInit {

  @Input() filterRecovered: ProductFilter;
  @Output() onSearch: EventEmitter<ProductFilter> = new EventEmitter();

  productFilter: ProductFilter = {};
  categories: Category[];
  private _categoriesSubscription: Subscription;

  /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|
  | Red Wine Path                                                    |
  |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  states = [
    {
      'id': 0,
      'name': '-'
    },
    {
      'id': 1,
      'name': 'En venta'
    },
    {
      'id': 2,
      'name': 'Vendido'
    }
  ];

  sortFields = [
    {
      'id': 0,
      'name': '-'
    },
    {
      'id': 1,
      'name': 'Precio'
    },
    {
      'id': 2,
      'name': 'Alfabéticamente'
    }
  ];

  /*sortFieldOrders = [
    {
      'id': 0,
      'name': '-'
    },
    {
      'id': 1,
      'name': 'ASC'
    },
    {
      'id': 2,
      'name': 'DESC'
    }
  ];*/

  constructor(private _categoryService: CategoryService) { }

  ngOnInit(): void {
    if (this.filterRecovered !== undefined){
      this.productFilter = this.filterRecovered;
      this.onSearch.emit(this.productFilter);
    }
    this._categoriesSubscription = this._categoryService
      .getCategories()
      .subscribe((data: Category[]) => this.categories = data);
  }

  ngOnDestroy(): void {
    this._categoriesSubscription.unsubscribe();
  }

  notifyHost(): void {
    this.onSearch.emit(this.productFilter);
  }

}
