"use client";
import React, { ReactNode } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState, persistor, store } from "./store";
import { PersistGate } from "redux-persist/integration/react";

interface ProvidersProps {
  children: ReactNode;
}

//provider
const ProvidersRedux: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>{children}</PersistGate>
    </Provider>
  );
};

//custom useSelector and useReducer
export const useAppSelector = useSelector<RootState>;
export const useAppDispatcher = useDispatch<AppDispatch>;

export default ProvidersRedux;
