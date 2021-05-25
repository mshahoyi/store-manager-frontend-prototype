import { Product } from "./productTypes";
import { Store } from "./storeTypes";
import { TimeMetadata } from "./sharedTypes";

export interface Category extends TimeMetadata {
  id: number;
  name: string;
  image: string;
  products: Product[];
  storeId: number;
  store: Store;
}
