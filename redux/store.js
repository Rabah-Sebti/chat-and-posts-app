import { configureStore } from "@reduxjs/toolkit";
import {
  useDispatch as useAppDispatch,
  useSelector as useAppSelector,
  useStore as useAppStore,
} from "react-redux";
import { persistStore, persistReducer } from "redux-persist";
import rootReducer, { rootPersistConfig } from "./rootReducer";

// ----------------------------------------------------------------------

const store = configureStore({
  reducer: persistReducer(rootPersistConfig, rootReducer),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
});
export const makeStore = () => {
  return store;
};
const persistor = persistStore(store);

const { dispatch } = store;

const useSelector = useAppSelector;

const useDispatch = () => useAppDispatch();
// const useDispatch = useAppDispatch;
const useStore = useAppStore;
export { store, persistor, dispatch, useSelector, useDispatch, useStore };
