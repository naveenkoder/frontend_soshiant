import { ArrowLeftOutlined, MenuOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import logoutIcon from "../../assets/logout.svg";
import { AuthenticationContext } from "../../contexts/authentication";
import { removeToken } from "../../data/api/auth";
import { useBack } from "../../hooks/use-back";
import "./header.css";
import { HistoryContext } from "../../contexts/history";
import { Col, Row } from "reactstrap";

function convertMsToDaysMonthsYears(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  return {
    days: days % 30,
    months: months % 12,
    years: years,
  };
}

export function HeaderComponent({ siderController }) {
  const { value: Authentication, dispatch: dispatchAuthentication } =
    useContext(AuthenticationContext);
  const { value: historyValue } = useContext(HistoryContext);
  const [redirect, setRedirect] = useState(false);
  const backButton = useBack();
  function logout() {
    dispatchAuthentication();
    removeToken();
    setRedirect(true);
  }
  const remaining = Number(localStorage.expire * 1000) - Date.now();
  const remainingDate = convertMsToDaysMonthsYears(remaining);

  const redColor =
    remainingDate.days <= 7 &&
    remainingDate.months <= 0 &&
    remainingDate.years <= 0;
  return (
    <>
      {redirect ? <Navigate to="/" /> : <></>}
      <div className="header-wrapper">
        <div>
          <Button
            className="back-button"
            disabled={historyValue.length < 1}
            onClick={backButton}
          >
            <ArrowLeftOutlined />
          </Button>
        </div>
        <div>
          <Button
            onClick={() => siderController()}
            className="sider-controller"
          >
            <MenuOutlined />
          </Button>
        </div>
        <div>
          <span className="welcome-paper">
            Hello {Authentication.username}{" "}
            <sup style={{ color: redColor ? "red" : "black" }}>
              (
              {remainingDate.years > 0 ? (
                <>
                  {remainingDate.years +
                    " " +
                    (remainingDate.years > 1 ? "years" : "years") +
                    " "}
                </>
              ) : (
                <></>
              )}
              {remainingDate.months > 0 ? (
                <>
                  {remainingDate.months +
                    " " +
                    (remainingDate.months > 1 ? "months" : "month") +
                    " "}
                </>
              ) : (
                <></>
              )}
              {remainingDate.days > 0 ? (
                <>
                  {remainingDate.days +
                    " " +
                    (remainingDate.days > 1 ? "days" : "day")}
                </>
              ) : (
                <></>
              )}
              {remaining <= 0 ? <>0 day</> : <></>})
            </sup>
          </span>
        </div>
        <div className="logout-paper">
          <Button
            type="default"
            style={{ backgroundColor: "#F5F5F5" }}
            className="row-center"
            onClick={logout}
            size={"large"}
          >
            <span>Logout</span>{" "}
            <img
              src={logoutIcon}
              style={{ margin: "0px 5px", width: "20px" }}
            />
          </Button>
        </div>
      </div>
    </>
  );
}

export default HeaderComponent;
