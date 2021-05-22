import { Product } from "./productTypes";
import { Store } from "./storeTypes";

export interface Category {
  id: number;
  name: string;
  image: string;
  products: Product[];
  storeId: number;
  store: Store;
}
