import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Product } from '../product';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent {

  @Input() data: Product;

  /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|
  | Green Path                                                       |
  |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|
  | Expón un atributo de salida con el decorador correspondiente. El |
  | tipo de dicho atributo debe permitir la emisión de eventos; la   |
  | idea es enviar al componente padre el producto sobre el cuál se  |
  | ha hecho clic. Y puesto que dicho clic se realiza en el template |
  | de este componente, necesitas, además, un manejador para el      |
  | mismo.                                                           |
  |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

  @Output() clickEnCompra = new EventEmitter<Product>();

  // No es necesario el parámetro 'producto'. En 'app-products-collection' podemos capturar el producto.
  // Se implementa por requisito del enunciado.
  notificarCompra(producto: Product): void {
    this.clickEnCompra.emit(producto);
  }

}
