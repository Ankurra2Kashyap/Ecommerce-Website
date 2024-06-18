import { applyMiddleware } from "redux";
import {thunk} from "redux-thunk";
import { configureStore } from '@reduxjs/toolkit'
import { composeWithDevTools } from "redux-devtools-extension";
import { newReviewReducer, productDetailsReducer, productReducer } from "./reducers/productReducer";
import { forgotPasswordReducer, profileReducer, userReducer } from "./reducers/userReducer";
import { cartReducer } from "./reducers/cartReduce";
import { myOrdersReducer, newOrderReducer, orderDetailsReducer } from "./reducers/orderReducer";

// Instead of combineReducers, pass your combined reducers directly
const rootReducer = {
  products: productReducer,
  productDetails: productDetailsReducer,
  user: userReducer,
  profile: profileReducer,
  forgotPassword: forgotPasswordReducer,
  cart: cartReducer,
  newOrder: newOrderReducer,
  myOrders: myOrdersReducer,
  orderDetails:orderDetailsReducer,
  newReview:newReviewReducer
};

let initialState = {
  cart: {
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
      shippingInfo:localStorage.getItem("shippingInfo")
      ? JSON.parse(localStorage.getItem("shippingInfo"))
      :{},
  }
};

// Define middleware as a callback function
const middleware = getDefaultMiddleware => [
  ...getDefaultMiddleware(),
  thunk,
];

// Pass the rootReducer directly to configureStore
const store = configureStore({
  reducer: rootReducer,
  preloadedState: initialState,
  middleware: middleware,
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
