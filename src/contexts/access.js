import { createContext } from "react";

export const AccessContext = createContext({
  dispatch: (access) => void 0,
  value: [],
});
