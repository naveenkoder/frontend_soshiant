import { createContext } from "react";

export const HistoryContext = createContext({
  push: (value = "") => void "",
  pop: () => "",
  value: [""],
});
