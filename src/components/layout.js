import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import UserPanel from "../users";
import NotFound from "../notFound/index";
import Login from "../login/index";
import { AuthenticationContext } from "../contexts/authentication";
import { useContext } from "react";

export default function Layout() {
  const { value: authenticationValue } = useContext(AuthenticationContext);
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" Component={Login} exact />
          {authenticationValue.loggedIn ? (
            <Route path="/page/:id" Component={UserPanel} />
          ) : (
            <></>
          )}
          <Route path="/login" Component={Login} />
          <Route path="*" Component={NotFound} />
        </Routes>
      </Router>
    </>
  );
}
