import { createStore } from "redux";
import reducer, { defaultState } from "./reducer";

const store = createStore(
  reducer,
  process.env.NODE_ENV !== "production" &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__()
);

export type AppState = typeof defaultState;

export default store;
