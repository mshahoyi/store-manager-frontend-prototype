import { Category } from "./categoryTypes";
import { TimeMetadata } from "./sharedTypes";

export interface Product extends TimeMetadata {
  id: number;
  name: string;
  image: string;
  price: number;
  categoryId: number;
  category: Category;
}
