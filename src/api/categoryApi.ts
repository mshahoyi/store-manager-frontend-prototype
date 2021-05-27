import BaseApi from "./base";
import { Category } from "../types/categoryTypes";
import store from "redux/store";
import axios from "axios";

class CategoryApi extends BaseApi<Category> {
	constructor() {
		super("categories");
	}

	post(data: Category) {
		const storeId = store.getState().store?.id;
		if (storeId) {
			data.storeId = storeId;
		}
		return super.post(data);
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
