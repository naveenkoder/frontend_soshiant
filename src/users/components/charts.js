import axios from "axios";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React, { useContext, useEffect, useState } from "react";
import { Breadcrumb, Dropdown, Menu, Button as AntdButton } from "antd";
import { DownOutlined, InfoCircleOutlined } from "@ant-design/icons";
import {
  Col,
  Container,
  Row,
  Table,
  UncontrolledAlert,
  Alert,
  Button,
} from "reactstrap";
import { getRoutesData } from "../../data/data.facade";
import "./charts.css";
import AccuracyChartDirector from "./services/director/accuracy.chart.director";
import ChangeChartDirector from "./services/director/change.chart.director";
import GaugeChartDirector from "./services/director/gauge.chart.director";
import HistoryChartDirector from "./services/director/history.chart.director";
import TopTenChartDirector from "./services/director/topten.chart.director";
import { RoutesContext } from "../../contexts/routes";
import { getParentsName } from "./services/breadcrumb.service";
import { SelectedFeatureContext } from "../../contexts/selectedFeature";
import { findChildren } from "./services/dropdown.service";
import { SelectedPeriodContext } from "../../contexts/selectedPeriod";
import Guide from "./guide";
import { NADataPage } from "./notFound";
import { findParent, findParentName } from "./services/search.service";
import { noise } from "./services/data.service";
import { ChartsDataContext } from "../../contexts/chartsData";
require("highcharts/modules/exporting")(Highcharts);
require("highcharts/modules/export-data")(Highcharts);
require("highcharts/highcharts-more.js")(Highcharts);
require("highcharts/modules/solid-gauge")(Highcharts);

const TopTenChart = ({ topten, showHome, size }) => {
  return (
    <Col className="chart-wrapper" md={size}>
      {topten && !showHome ? (
        <div className="chart-padding">
          <HighchartsReact options={topten} highcharts={Highcharts} />
        </div>
      ) : (
        <></>
      )}
    </Col>
  );
};

const Gauge = ({ gauge, showHome, size }) => {
  return (
    <Col className="chart-wrapper" md={size}>
      {gauge && !showHome ? (
        <div className="chart-padding guage-wrapper">
          <HighchartsReact options={gauge} highcharts={Highcharts} />
        </div>
      ) : (
        <></>
      )}
    </Col>
  );
};
const Periods = ({ routes, onChange }) => {
  function onClick(e) {
    onChange(String(e.key));
  }
  
  return (
    <Menu
      onClick={onClick}
      items={routes.map((i) => ({ label: i.name, key: i.id }))}
    />
  );
};

const PercentageChanges = ({ percentageChanges, showHome, size }) => {
  return (
    <Col className="chart-wrapper" md={size}>
      {percentageChanges && !showHome ? (
        <div className="chart-padding">
          <HighchartsReact
            options={percentageChanges}
            highcharts={Highcharts}
          />
        </div>
      ) : (
        <></>
      )}
    </Col>
  );
};

const DataStates = {
  Available: 0,
  Unavailable: 1,
  Unselect: 2,
};
const RouteHeader = ({
  setAlerts = () => {},
  alerts = [],
  siderController = () => {},
}) => {
  const { value: routes } = useContext(RoutesContext);
  console.log('------->',routes)
  const { value: selectedFeature } = useContext(SelectedFeatureContext);
  const { value: selectedPeriod, dispatch: dispatchSelectedPeriod } =
    useContext(SelectedPeriodContext);
  const isDesktop = window.innerWidth > 768;
  const [routesChildren, setRoutesChildren] = useState([]);
  const [isDefault, setIsDefault] = useState(true);
  const [showAll, setShowAll] = useState(true);
  const [firstPeriod, setFirstPeriod] = useState("Loading...");

  function onChangeAlert() {
    console.log({ showAll, alerts });
    if (showAll) setAlerts(alerts);
    else setAlerts(alerts.filter((i) => i.color !== "info"));
    setShowAll(!showAll);
  }

  useEffect(() => {
    const firstChild = routesChildren[0];
    const str = selectedFeature + "-" + selectedPeriod;
    const isDefaultPage = String(localStorage.defaultFeature) === String(str);
    if (isDefaultPage) {
      return;
    }
    setFirstPeriod(firstChild?.name || "Loading...");
    
    setShowAll(true);
    setAlerts([])
    if (firstChild !== undefined) changePeriod(firstChild?.id);
  }, [routesChildren]);
  useEffect(() => {
    const children = findChildren(routes, selectedFeature);
    const PeriodEnum = {
      weekly: 1,
      monthly: 2,
      quarterly: 3,
      annually: 4,
      annual: 5,
    };
    const SortedRoutes = children.sort((a, b) => {
      return (
        PeriodEnum[a.period.trim().toLowerCase()] -
        PeriodEnum[b.period.trim().toLowerCase()]
      );
    });
    
    setRoutesChildren(SortedRoutes);
    if (isFeature() && !isDesktop) {
      siderController(false);
    }
    setShowAll(true);
    setAlerts([])
  }, [selectedFeature]);

  function onSetDefault(e) {
    const str = selectedFeature + "-" + selectedPeriod;
    const isDefaultPage = String(localStorage.defaultFeature) === String(str);
    setIsDefault(!isDefaultPage);
    if (isDefaultPage) localStorage.defaultFeature = "guide";
    else localStorage.defaultFeature = str;
    console.log(localStorage.defaultFeature, isDefaultPage);
  }
  function isFeature() {
    const children = findChildren(routes, selectedFeature);
    const pass = children.some((i) => i.period !== "");
    return pass;
  }

  function changePeriod(key) {
    dispatchSelectedPeriod(key);
    setAlerts([]);
    // const str = selectedFeature + "-" + selectedPeriod;
    // const isDefaultPage = String(localStorage.defaultFeature) === String(str);
    // setIsDefault(isDefaultPage);
  }

  useEffect(() => {
    const str = selectedFeature + "-" + selectedPeriod;
    const isDefaultPage = String(localStorage.defaultFeature) === String(str);
    setIsDefault(isDefaultPage);
    console.log("useEffect []");
  }, []);
  useEffect(() => {
    const str = selectedFeature + "-" + selectedPeriod;
    const isDefaultPage = String(localStorage.defaultFeature) === String(str);
    setIsDefault(isDefaultPage);
    console.log("useEffect []");
  }, [selectedFeature, selectedPeriod]);

  return (
    <Col className="chart-wrapper breadcrumb" md={12}>
      <div className="chart-padding routes-info">
        <Row>
          <Col md={6} sm={12}>
            <span>
              <Breadcrumb
                items={getParentsName(routes, selectedFeature).map((name) => ({
                  title: name,
                }))}
              />
            </span>
          </Col>
          <Col md={6} sm={12}>
            {isFeature() ? (
              <div
                className="header-route"
              >
                <AntdButton onClick={onChangeAlert}>Info</AntdButton>

                <AntdButton onClick={onSetDefault}>
                  {isDefault ? "Remove Default Route" : "Set as Default Route"}
                </AntdButton>
                <div>
                  <span className="text">Period:</span>
                  <Dropdown
                    overlay={
                      <Periods
                        onChange={changePeriod}
                        routes={routesChildren}
                      />
                    }
                    trigger={["click"]}
                  >
                    <AntdButton>
                      <>
                        {routes.find(
                          (i) => String(i.id) === String(selectedPeriod)
                        )?.name || firstPeriod}
                        <DownOutlined />
                      </>
                    </AntdButton>
                  </Dropdown>
                </div>
              </div>
            ) : (
              <></>
            )}
          </Col>
        </Row>
      </div>
    </Col>
  );
};

const HistoryChart = ({ historyChart, showHome, size }) => {
  return (
    <Col className="chart-wrapper" sm={size}>
      {historyChart && !showHome ? (
        <div className="chart-padding">
          <HighchartsReact options={historyChart} highcharts={Highcharts} />
        </div>
      ) : (
        <></>
      )}
    </Col>
  );
};

const AccuracyChart = ({ showHome, tableValue, accuracyChart, size }) => {
  return (
    <Col className="chart-wrapper" md={12}>
      {accuracyChart && !showHome ? (
        <div className="chart-padding">
          <HighchartsReact options={accuracyChart} highcharts={Highcharts} />
        </div>
      ) : (
        <></>
      )}
    </Col>
  );
};

function getValues(chartsData, chartName) {
  const chartData = chartsData.find((item) => item.chartName === chartName);
  const info = chartData?.value;
  return {
    title: info?.title,
    content: info?.description,
  };
}

const Charts = ({ siderController }) => {
  const [accuracyChart, setAccuracyChart] = useState(false);
  const [percentageChanges, setPercentageChanges] = useState(false);
  const [historyChart, setHistoryChart] = useState(false);
  const [gauge, setGauge] = useState(false);
  const [topten, setTopten] = useState(false);
  const [DataStatus, setDataStatus] = useState(DataStates.Unselect);
  const [tableValue, setTableValue] = useState(false);
  const { value: chartsData } = useContext(ChartsDataContext);
  const [alerts, setAlerts] = useState([]);
  const [showAlert, setShowAlerts] = useState([]);
  const { value: selectedPeriod } = useContext(SelectedPeriodContext);
  const { value: selectedFeature } = useContext(SelectedFeatureContext);
  const { value: routes } = useContext(RoutesContext);
  console.log('routes',routes)
  useEffect(() => {
    setDataStatus(DataStates.Unselect);
    setAlerts([]);
  }, [selectedFeature]);
  useEffect(() => {
    setPercentageChanges(false);
    setHistoryChart(false);
    setGauge(false);
    setTopten(false);
    setAccuracyChart(false);
    setDataStatus(DataStates.Unselect);
    getRoutesData(selectedPeriod)
      .then((res) => {
        const data = res.data;
        console.log('data --->',data)
        try {
          if (data.routeData !== null) {
            let parentAlerts = routes.find(
              (i) => String(i.id) === String(data.routeData.parent)
            ).alerts;
            parentAlerts = JSON.parse(parentAlerts) || [];
            const routeAlerts = JSON.parse(data.routeData.alerts) || [];

            const allAlerts = parentAlerts.concat(routeAlerts);

            if (Array.isArray(allAlerts)) {
              setAlerts(allAlerts);
              setShowAlerts(routeAlerts.filter((i) => i.color !== "info"));
            }
          }
        } catch (error) {}
        if (data.actualValue === null || data.predictValue === null) {
          if (Number(selectedPeriod) !== 0) {
            if (
              findChildren(routes, selectedFeature)?.some(
                (i) => i.period !== ""
              )
            ) {
              setDataStatus(DataStates.Unavailable);
            }
          }
          return;
        }
        setDataStatus(DataStates.Available);
        // setTableValue({
        //   average_accuracy: data.actualValue.average_accuracy,
        //   confidence_level: data.actualValue.confidence_level,
        // });
        // let routeName = findParentName(routes, selectedPeriod);
        let routeName = findParentName(routes, selectedPeriod);
        // if (
        //   typeof data.actualValue.value === "string" &&
        //   data.actualValue.value !== ""
        //   ) {
        //   }
        data.actualValue.value = JSON.parse(data.actualValue.value || "{}").map(
          (item, index) => {
            item.Actual_value = noise(item.Actual_value, data.routeData.id, index);
            return item;
          }
        );
        data.actualValue.value = JSON.stringify(data.actualValue.value);

        try {
          const accuracyInformation = getValues(
            chartsData,
            "user-panel-chart-accuracy"
          );
          setAccuracyChart(
            AccuracyChartDirector(data, routeName, accuracyInformation.title)
          );
        } catch (error) {
          console.error(error);
        }
        try {
          const changesInformation = getValues(
            chartsData,
            "user-panel-chart-changes"
          );
          setPercentageChanges(
            ChangeChartDirector(data, routeName, changesInformation.title)
          );
        } catch (error) {
          console.error(error);
        }
        try {
          const historyInformation = getValues(
            chartsData,
            "user-panel-chart-history"
          );
          setHistoryChart(
            HistoryChartDirector(data, routeName, historyInformation.title)
          );
        } catch (error) {
          console.error(error);
        }
        try {
          const gaugeInformation = getValues(
            chartsData,
            "user-panel-chart-gauge"
          );
          setGauge(GaugeChartDirector(data, routeName, gaugeInformation.title));
        } catch (error) {
          console.error(error);
        }
        try {
          const toptenInformation = getValues(
            chartsData,
            "user-panel-chart-topten"
          );
          setTopten(
            TopTenChartDirector(data, routeName, toptenInformation.title)
          );
        } catch (error) {
          console.error(error);
        }
      })
      .catch((err) => {
        if (!axios.isCancel(err)) console.error(err);
      });
  }, [selectedPeriod]);
  return String(selectedFeature) === "guide" ? (
    <Guide />
  ) : (
    <Container className="chart-container">
      <Row className="row-container">
        <>
          <RouteHeader
            siderController={siderController}
            setAlerts={setShowAlerts}
            alerts={alerts}
          />
          {showAlert.map((item) => {
            return <Alert color={item.color}>{item.content}</Alert>;
          })}
          {DataStatus !== DataStates.Available ? (
            <NADataPage isDataAvailable={DataStatus === DataStates.Unselect} />
          ) : (
            <>
              <AccuracyChart
                size={12}
                accuracyChart={accuracyChart}
                tableValue={tableValue}
              />
              <HistoryChart size={6} historyChart={historyChart} />
              <PercentageChanges
                size={6}
                percentageChanges={percentageChanges}
              />
              <Gauge gauge={gauge} size={6} />
              <TopTenChart size={6} topten={topten} />
            </>
          )}
        </>
      </Row>
    </Container>
  );
};

export default Charts;
