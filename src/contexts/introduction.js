import { createContext } from "react";

export const IntroductionContext = createContext({
  dispatch: (introductionData) => void 0,
  value: [],
});
