import { Category } from "./categoryTypes";

export interface Store {
  id: number;
  name: string;
  logo: string;
  categories: Category[];
}
