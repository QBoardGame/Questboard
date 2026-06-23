import { combineReducers } from "@reduxjs/toolkit";
import profile from "./profileSlice";
import game from "./gameSlice"

const rootReducer = combineReducers({
  profile,
  game,
});

export type RootReducer = ReturnType<typeof rootReducer>;
export default rootReducer;
