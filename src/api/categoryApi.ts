import BaseApi from "./base";
import { Category } from "../types/categoryTypes";
import store from "redux/store";
import axios from "axios";
import { ApiPaginatedData } from "../types/sharedTypes";

class CategoryApi extends BaseApi<Category> {
  constructor() {
    super("categories");
  }

  dataTable(): Promise<ApiPaginatedData<Category>> {
    const storeId = store.getState().store?.id;
    return axios.get(this.url + "store/" + Number(storeId)).then((r) => r.data);
  }

  get(id: number): Promise<Category> {
    const storeId = store.getState().store?.id;
    return axios
      .get(this.url + "store/" + Number(storeId) + "/" + id)
      .then((r) => r.data);
  }

  post(data: Category): Promise<Category> {
    const storeId = store.getState().store?.id;
    return super.post(data, storeId);
  }

  patch(id: number, data: Category): Promise<Category> {
    const storeId = store.getState().store?.id;
    return super.patch(id, data, storeId);
  }

  list(): Promise<Category[]> {
    return axios
      .get(this.url + "list/" + store.getState().store?.id)
      .then((response) => response.data)
      .catch((err) => {
        throw err.data;
      });
  }
}

export const categoryApi = new CategoryApi();
