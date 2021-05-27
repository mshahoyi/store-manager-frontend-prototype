import BaseApi from "./base";
import { Product } from "../types/productTypes";

class ProductApi extends BaseApi<Product> {
	constructor() {
		super("products");
	}

	post(data: Product) {
		return super.post(data);
	}
}

export const productApi = new ProductApi();
