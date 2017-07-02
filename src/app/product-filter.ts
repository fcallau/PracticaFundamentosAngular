export interface ProductFilter {
    text?: string;
    category?: string;
    state?: string;
    minPrecio?: string;
    maxPrecio?: string;
    sortField?: string;
    sellerId?:string;
    excludeProductId?:string;
}
