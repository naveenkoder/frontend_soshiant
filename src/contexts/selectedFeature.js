import { createContext } from "react";

export const SelectedFeatureContext = createContext({
  dispatch: (key) => void 0,
  value: 0,
});
