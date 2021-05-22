import BaseApi from "./base";
import { Store } from "../types/storeTypes";

class StoreApi extends BaseApi<Store> {
  constructor() {
    super("stores");
  }
}

export const storeApi = new StoreApi();
