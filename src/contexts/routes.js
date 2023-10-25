import { createContext } from "react";

export const RoutesContext = createContext({
  dispatch: (routes) => void 0,
  value: [],
});
