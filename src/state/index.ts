import { configureStore } from "@reduxjs/toolkit";
import farmsReducer from "./farms";
import dualFarmsReducer from "./dualFarms";

export default configureStore({
  devTools: process.env.NODE_ENV !== "production",
  reducer: {
    farms: farmsReducer,
    dualFarms: dualFarmsReducer,
  },
});
