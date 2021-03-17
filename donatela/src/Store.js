import React, { createContext, useReducer } from "react";
import Reducer from "./Reducer";

const initialState = {
  auth: {
    token: localStorage.getItem("token"),
    refreshToken: localStorage.getItem("refreshToken"),
    userId: localStorage.getItem("userId"),
    username: localStorage.getItem("username"),
    preference: localStorage.getItem("preference"),
    isAdmin: localStorage.getItem("isAdmin"),
  },
};

const Store = ({ children }) => {
  const [state, dispatch] = useReducer(Reducer, initialState);
  return (
    <Context.Provider value={[state, dispatch]}>{children}</Context.Provider>
  );
};

export const Context = createContext(initialState);
export default Store;
