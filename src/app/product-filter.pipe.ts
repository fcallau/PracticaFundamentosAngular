import { Pipe, PipeTransform } from '@angular/core';

import { Product } from './product';
import { ProductFilter } from './product-filter';

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|
| Red Wine Path (con Pipes)                                        |
|~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

@Pipe({
  name: 'productFilter'
})
export class ProductFilterPipe implements PipeTransform {

  transform(products: Product[], filter: ProductFilter): Product[] {
    let productsToReturn: Product[] = products;
    let index: number;

    if (filter) {
      // Selecciona en función de si ha sido seleccionado el criterio 'En venta' ('1') o 'Vendido' ('2').
      if (filter.state === '1' || filter.state === '2') {
        index = 0;
        while (index < productsToReturn.length) {
          if (filter.state === '1') {
            if (productsToReturn[index].state === 'sold') {
              productsToReturn.splice(index, 1);
            } else {
              index++;
            }
          } else {
            if (productsToReturn[index].state === 'selling') {
              productsToReturn.splice(index, 1);
            } else {
              index++;
            }
          }
        }
      }

      // Si se selecciona el precio mínimo.
      if (filter.minPrecio) {
        index = 0;
        while (index < productsToReturn.length) {
          if (productsToReturn[index].price < +filter.minPrecio) {
            productsToReturn.splice(index, 1);
          } else {
            index++;
          }
        }
      }

      // Si se selecciona el precio máximo.
      if (filter.maxPrecio) {
        index = 0;
        while (index < productsToReturn.length) {
          if (productsToReturn[index].price > +filter.maxPrecio) {
            productsToReturn.splice(index, 1);
          } else {
            index++;
          }
        }
      }

      // Si se ordena por 'Precio' ('1') o 'Alfabéticamente' ('2').
      if (filter.sortField === '1' || filter.sortField === '2') {
        if (filter.sortField === '1') {
          productsToReturn.sort((a: Product, b: Product): number => {
            if (a.price > b.price) {
              return 1;
            } else if (a.price < b.price) {
              return -1;
            } else {
              return 0;
            }
          });
        } else {
          productsToReturn.sort((a: Product, b: Product): number => {
            if (a.name > b.name) {
              return 1;
            } else if (a.name < b.name) {
              return -1;
            } else {
              return 0;
            }
          });
        }
      }

      /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|
      | Red Wine Path (con Pipes)                                        |
      |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

      // Si viene informado el id del vendedor se usa el filtro para obtener los productos de dicho vendedor sin contemplar el id del producto que 'dispara' la búsqueda
      if (filter.sellerId) {
        index = 0;
        while (index < productsToReturn.length) {
          // Se quita de la colección deproductos los que no pertenecen al vendedor
          if (productsToReturn[index].seller.id !== +filter.sellerId) {
            productsToReturn.splice(index, 1);
          // En el caso que se trate del producto que 'dispara' la búsqueda no se muestra como otros productos del vendedor
          } else if (productsToReturn[index].id === +filter.excludeProductId) {
            productsToReturn.splice(index, 1);
          // En el caso que se trate de un producto ya vendido también se excluye de la colección a devolver
          } else if (productsToReturn[index].state === 'sold') {
            productsToReturn.splice(index, 1);
          } else {
            index++;
          }
        }
      }

      return productsToReturn;
    }

    return products;
  }

}
