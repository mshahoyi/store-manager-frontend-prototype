import BaseApi from "./base";
import { Product } from "../types/productTypes";
import { ApiPaginatedData } from "../types/sharedTypes";
import store from "../redux/store";

class ProductApi extends BaseApi<Product> {
  constructor() {
    super("products");
  }

  dataTable(): Promise<ApiPaginatedData<Product>> {
    const storeId = store.getState().store?.id;
    return super.dataTable(storeId);
  }

  post(data: Product): Promise<Product> {
    const storeId = store.getState().store?.id;
    return super.post(data, storeId);
  }

  patch(id: number, data: Product): Promise<Product> {
    const storeId = store.getState().store?.id;
    return super.patch(id, data, storeId);
  }
}

export const productApi = new ProductApi();
