import { Category } from "./categoryTypes";

export interface Store {
  id: number;
  name: string;
  logo: string | File | null;
  categories: Category[];
}
