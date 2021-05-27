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
    return super.dataTable(storeId);
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
