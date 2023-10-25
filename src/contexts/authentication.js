import { createContext } from "react";

export const AuthenticationContext = createContext({
  dispatch: (username = "", token = "", loggedIn = false) => void 0,
  value: {
    username: "",
    token: "",
    loggedIn: false,
  },
});
