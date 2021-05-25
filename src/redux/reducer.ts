import { Store } from "../types/storeTypes";
import { ActionTypes } from "./actions";

export default function reducer(
  state = defaultState,
  action: { type: string; payload: unknown }
) {
  switch (action.type) {
    case ActionTypes.USE_STORE:
      return { ...state, store: action.payload as Store };

    default:
      return state;
  }
}

export const defaultState = {
  store: null as Store | null,
};
