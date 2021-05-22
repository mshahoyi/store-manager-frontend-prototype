import BaseApi from "./base";
import { Product } from "../types/productTypes";

class ProductApi extends BaseApi<Product> {
  constructor() {
    super("products");
  }
}

export const productApi = new ProductApi();
