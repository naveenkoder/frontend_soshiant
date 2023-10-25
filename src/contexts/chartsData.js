import { createContext } from "react";

/**
 * @type {import("react").Context<{dispatch: (value: import("../data/data.facade").ChartsData) => void, value: import("../data/data.facade").ChartsData}>}
 */
export const ChartsDataContext = createContext({
  dispatch: (value) => void 0,
  value: {
    username: "",
    token: "",
    loggedIn: false,
  },
});
