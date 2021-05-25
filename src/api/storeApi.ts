import BaseApi from "./base";
import { Store } from "../types/storeTypes";

class StoreApi extends BaseApi<Store> {
  constructor() {
    super("stores");
  }

  list() {
    return super.dataTable() as unknown as Promise<Store[]>;
  }
}

export const storeApi = new StoreApi();
