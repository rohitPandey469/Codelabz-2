import { combineReducers } from "redux";
import editorReducer from "./editorReducer";
import dataReducer from "./dataReducer";
import createReducer from "./createReducer";
import currentReducer from "./currentReducer";
import imageReducer from "./imageReducer";
import votesReducer from "./votesReducer";

export default combineReducers({
  editor: editorReducer,
  data: dataReducer,
  create: createReducer,
  current: currentReducer,
  images: imageReducer,
  vote: votesReducer
});
