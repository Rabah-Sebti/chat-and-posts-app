import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
// slices
// import profileReducer from "./slices/profile";
import postReducer from "./slices/post";
import chatReducer from "./slices/chat";
import commentReducer from "./slices/comment";
import profileReducer from "./slices/profile";

// ----------------------------------------------------------------------

export const rootPersistConfig = {
  key: "root",
  storage,
  keyPrefix: "redux-",
  whitelist: [],
};

const rootReducer = combineReducers({
  post: postReducer,
  chat: chatReducer,
  comment: commentReducer,
  profile: profileReducer,
});

export default rootReducer;
