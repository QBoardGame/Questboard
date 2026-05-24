import { combineReducers } from "@reduxjs/toolkit";
import background from "screens/background/stores/background";
import profile from "app/shared/profileSlice";

const rootReducer = combineReducers({
  background,
  profile,
});

export type RootReducer = ReturnType<typeof rootReducer>;
export default rootReducer;
