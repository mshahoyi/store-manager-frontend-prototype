import { Category } from "./categoryTypes";
import { TimeMetadata } from "./sharedTypes";
import { Store } from "./storeTypes";

export interface Product extends TimeMetadata {
  id: number;
  name: string;
  image: string;
  price: number;
  categoryId: number;
  category: Category;
  storeId: number;
  store: Store;
}
