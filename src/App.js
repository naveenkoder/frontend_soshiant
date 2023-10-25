import "./App.css";
import { useEffect, useState } from "react";
import Layout from "./components/layout";
import { getChartsData, getNotes } from "./data/data.facade";
import { AuthenticationContext } from "./contexts/authentication";
import "bootstrap/dist/css/bootstrap.min.css";
import { AccessContext } from "./contexts/access";
import { RoutesContext } from "./contexts/routes";
import { ChartsDataContext } from "./contexts/chartsData";
import { SelectedFeatureContext } from "./contexts/selectedFeature";
import { SelectedPeriodContext } from "./contexts/selectedPeriod";
import axios from "axios";
import { HistoryContext } from "./contexts/history";
import { IntroductionContext } from "./contexts/introduction";
function App() {
  const [authentication, setAuthentication] = useState({
    username: "",
    token: "",
    loggedIn: false,
  });
  const [access, setAccess] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [selectedFeature, setSelectedFeature] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState(0);
  const [chartsData, setChartsData] = useState([]);
  const [history, setHistory] = useState([]);
  const [introductionData, setIntroductionData] = useState([]);
  const authenticationValue = {
    dispatch: (username = "", token = "", loggedIn = false) =>
      setAuthentication({
        username,
        token,
        loggedIn,
        logginTime: Date.now(),
      }),
    value: authentication,
  };
  const accessValue = {
    dispatch: (access) => setAccess(access),
    value: access,
  };
  const RoutesValue = {
    dispatch: (routes) => setRoutes(routes),
    value: routes,
  };
  const selectedFeatureValue = {
    dispatch: (key) => {
      if (key === undefined) return;
      setSelectedFeature(key);
      setSelectedPeriod(0);
    },
    value: selectedFeature,
  };
  const selectedPeriodValue = {
    dispatch: (key) => setSelectedPeriod(key),
    value: selectedPeriod,
  };
  const chartsDataValue = {
    dispatch: (key) => setChartsData(key),
    value: chartsData,
  };
  const IntroductionValue = {
    dispatch: (key) => setIntroductionData(key),
    value: introductionData,
  };
  const historyValue = {
    push: (route) => {
      const temp = history;
      temp.push(route);
      setHistory(temp);
    },
    pop: () => {
      const temp = history;
      const value = temp.pop();
      setHistory(temp);
      return value;
    },
    value: history,
  };

  useEffect(() => {
    const cancelToken = axios.CancelToken.source();
    getChartsData(cancelToken.token)
      .then((response) => {
        setChartsData(response);
      })
      .catch((e) => {
        if (!axios.isCancel(cancelToken)) console.error(e);
      });
    return () => {
      cancelToken.cancel();
    };
  }, []);
  useEffect(() => {
    const cancelToken = axios.CancelToken.source();
    getNotes(cancelToken.token)
      .then((res) => {
        setIntroductionData(res)
      })
      .catch(console.log);
    return () => {
      cancelToken.cancel();
    };
  }, []);

  return (
    <AuthenticationContext.Provider value={authenticationValue}>
      <AccessContext.Provider value={accessValue}>
        <RoutesContext.Provider value={RoutesValue}>
          <SelectedFeatureContext.Provider value={selectedFeatureValue}>
            <SelectedPeriodContext.Provider value={selectedPeriodValue}>
              <ChartsDataContext.Provider value={chartsDataValue}>
                <HistoryContext.Provider value={historyValue}>
                  <IntroductionContext.Provider value={IntroductionValue}>
                    <Layout />
                  </IntroductionContext.Provider>
                </HistoryContext.Provider>
              </ChartsDataContext.Provider>
            </SelectedPeriodContext.Provider>
          </SelectedFeatureContext.Provider>
        </RoutesContext.Provider>
      </AccessContext.Provider>
    </AuthenticationContext.Provider>
  );
}

export default App;
