import { combineReducers } from "@reduxjs/toolkit";
import profile from "./profileSlice";

const rootReducer = combineReducers({
  profile,
});

export type RootReducer = ReturnType<typeof rootReducer>;
export default rootReducer;
