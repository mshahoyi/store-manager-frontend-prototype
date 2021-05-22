import BaseApi from "./base";
import { Category } from "../types/categoryTypes";

class CategoryApi extends BaseApi<Category> {
  constructor() {
    super("categories");
  }
}

export const categoryApi = new CategoryApi();
