import { createContext } from "react";

export const SelectedPeriodContext = createContext({
  dispatch: (key) => void 0,
  value: 0,
});
