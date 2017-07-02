import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerProductsCollectionComponent } from './seller-products-collection.component';

describe('SellerProductsCollectionComponent', () => {
  let component: SellerProductsCollectionComponent;
  let fixture: ComponentFixture<SellerProductsCollectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellerProductsCollectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellerProductsCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
