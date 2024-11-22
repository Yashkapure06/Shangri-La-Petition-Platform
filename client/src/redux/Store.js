import { applyMiddleware, compose, createStore, combineReducers } from "redux";
import { thunk } from "redux-thunk";

const initialState = {};
const middleWares = [thunk];
let devtools = (x) => x;

const RootReducer = combineReducers({});

export const Store = createStore(
  RootReducer,
  initialState,
  compose(applyMiddleware(...middleWares), devtools)
);
