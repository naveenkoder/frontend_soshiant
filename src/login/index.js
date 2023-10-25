import "./style.css";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { AuthenticationContext } from "../contexts/authentication.js";
import logoImage from "../assets/logo.png";
import { Navigate } from "react-router-dom";
import { Spinner } from "reactstrap";
import { SelectedFeatureContext } from "../contexts/selectedFeature";
import { SelectedPeriodContext } from "../contexts/selectedPeriod";
import { Input, Button } from "antd";
import {
  getAccessItem,
  loginRequest,
  getMenuItem,
  getLocalToken,
  checkTokenRequest,
} from "../data/data.facade";
import { useContext, useEffect, useState } from "react";
import { AccessContext } from "../contexts/access";
import { RoutesContext } from "../contexts/routes";

export default function Login({}) {
  const statusType = {
    none: undefined,
    error: "error",
  };
  const [status, setStatus] = useState(statusType.none);
  const { dispatch: dispatchAccess, value: Access } = useContext(AccessContext);
  const { dispatch: dispatchSelectedFeature } = useContext(
    SelectedFeatureContext
  );
  const { dispatch: dispatchSelectedPeriod } = useContext(
    SelectedPeriodContext
  );
  const [redirect, setRedirect] = useState(false);
  const [username, setUsername] = useState("");
  const userAuthentication = getLocalToken();
  const [isLoading, setIsLoading] = useState(userAuthentication.status);
  const [autoLogin, setAutoLogin] = useState(userAuthentication.status);
  const [password, setPassword] = useState("");

  const {
    dispatch: dispatchAuthentication,
    value: AuthenticationContextValue,
  } = useContext(AuthenticationContext);
  const { dispatch: dispatchRoutes } = useContext(RoutesContext);

  useEffect(() => {
    if (userAuthentication.status) {
      setIsLoading(true);
      checkTokenRequest(
        userAuthentication.password,
        userAuthentication.username
      )
        .then(async () => {
          dispatchAuthentication(
            userAuthentication.username,
            userAuthentication.password,
            true
          );
        })
        .catch(() => {
          dispatchAuthentication();
          setIsLoading(false);
          setAutoLogin(false);
        });
    }
  }, [0]);

  useEffect(() => {
    if (!AuthenticationContextValue.loggedIn) return;
    initializeUserPanel().then(() => {
      setTimeout(() => {
        const [feature, period] = localStorage.defaultFeature?.split("-") || [
          "guide",
          0,
        ];
        dispatchSelectedFeature(feature || "guide");
        dispatchSelectedPeriod(period);
        setRedirect(true);
      }, 2000);
    });
  }, [AuthenticationContextValue]);

  function sendLoginRequest() {
    setStatus(statusType.none);
    if (username.trim() === "") {
      setStatus(statusType.error);
      return;
    }
    setIsLoading(true);
    loginRequest(username, password)
      .then(async (response) => {
        const status = Boolean(response);
        setStatus(status ? statusType.none : statusType.error);
        dispatchAuthentication(username, response, status);
      })
      .catch((error) => {
        console.error(error);
        setStatus(statusType.error);
        dispatchAuthentication();
        setIsLoading(false);
        setAutoLogin(false);
      });
  }

  async function initializeUserPanel() {
    await getAccess();
    await getRoutes();
  }

  async function getAccess() {
    const { access, expire } = await getAccessItem();
    dispatchAccess(access);
    localStorage.expire = expire;
    const [feature, period] = localStorage.defaultFeature?.split("-") || [
      "guide",
      0,
    ];
    if (period !== 0) {
      if (!access.includes(Number(period))) {
        localStorage.removeItem("defaultFeature");
        console.log({
          period,
          access,
        });
        dispatchSelectedFeature("guide");
        dispatchSelectedPeriod(period);
        return;
      }
    }
  }
  async function getRoutes() {
    const routes = await getMenuItem();
    dispatchRoutes(routes);
  }

  return (
    <>
      {redirect ? <Navigate to={`/page/0`} /> : <></>}
      <div className="login-wrapper">
        {isLoading ? (
          <div className="loading">
            <span className="loading-text">Loading</span> <Spinner size="lg" />
          </div>
        ) : (
          <div className="authentication-panel">
            <img src={logoImage} alt="Soshianest Logo" />
            <Input
              className="authentication-input"
              placeholder="Username"
              status={status}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              prefix={<UserOutlined />}
            />
            <Input
              className="authentication-input"
              placeholder="Password"
              status={status}
              value={password}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              prefix={<LockOutlined />}
            />
            <Button
              onClick={sendLoginRequest}
              className="authentication-submit"
              type="primary"
            >
              Login
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
