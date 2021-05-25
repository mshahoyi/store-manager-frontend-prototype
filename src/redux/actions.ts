import { Store } from "../types/storeTypes";

export const ActionTypes = {
  USE_STORE: "use_store",
};

export const setStore = (store: Store) => ({
  type: ActionTypes.USE_STORE,
  payload: store,
});
