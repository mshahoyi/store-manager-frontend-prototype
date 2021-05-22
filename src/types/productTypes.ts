import { Category } from "./categoryTypes";

export interface Product {
  id: number;
  name: string;
  image: string;
  categoryId: number;
  category: Category;
}
