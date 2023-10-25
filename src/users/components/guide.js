import { useContext, useEffect, useState } from "react";
import { Col, Container, Row } from "reactstrap";
import accuracyImage from "../../assets/accuracy.png";
import changesImage from "../../assets/changes.png";
import gaugeImage from "../../assets/gauge.png";
import historyImage from "../../assets/history.png";
import toptenImage from "../../assets/topten.png";
import { ChartsDataContext } from "../../contexts/chartsData";
import { IntroductionContext } from "../../contexts/introduction";
import { Accordion } from "./accordion";
import "./guide.css";

function getChartImage(chartName) {
  switch (chartName) {
    case "user-panel-chart-accuracy":
      return accuracyImage;
    case "user-panel-chart-history":
      return historyImage;
    case "user-panel-chart-changes":
      return changesImage;
    case "user-panel-chart-gauge":
      return gaugeImage;
    case "user-panel-chart-topten":
      return toptenImage;
    default:
      return "";
  }
}
/**
 *
 * @param {import("../../data/data.facade").ChartsData} chartsData
 * @param {string} chartName
 */
function getValues(chartsData, chartName) {
  const chartData = chartsData.find((item) => item.chartName === chartName);
  const info = chartData?.value;
  return {
    title: info?.title,
    content: info?.description,
    image: getChartImage(chartName),
  };
}

function getPageContent(result, title) {
  return (
    result.find((page) => page.page_title.trim() === title.trim())
      ?.page_content || "<p></p>"
  );
}

export function Guide({}) {
  const { value: chartsData } = useContext(ChartsDataContext);
  const { value: introductionData } = useContext(IntroductionContext);
  const [guides, setGuides] = useState([]);
  const [note, setNote] = useState("<p></p>");
  const [about, setAbout] = useState("<p></p>");
  const [contactUs, setContactUs] = useState("<p></p>");
  const [address, setAddress] = useState("<p></p>");

  useEffect(() => {
    setGuides([
      getValues(chartsData, "user-panel-chart-accuracy"),
      getValues(chartsData, "user-panel-chart-history"),
      getValues(chartsData, "user-panel-chart-changes"),
      getValues(chartsData, "user-panel-chart-gauge"),
      getValues(chartsData, "user-panel-chart-topten"),
    ]);
    setNote(getPageContent(introductionData, "Introduction"));
    setAbout(getPageContent(introductionData, "About"));
    setContactUs(getPageContent(introductionData, "ContactUs"));
    setAddress(getPageContent(introductionData, "Address"));
    
  }, []);

  return (
    <Container>
      <Row>
        <Col md={12}>
          <div
            className="note-wrapper"
            dangerouslySetInnerHTML={{
              __html: note,
            }}
          ></div>
        </Col>
        <Col md={12}>
          {guides.map((item, index) => (
            <Accordion
              key={"guide" + index}
              isOpen={index === 0}
              image={item?.image || ""}
              title={item?.title || ""}
              content={item?.content || ""}
            />
          ))}
        </Col>
        <Col md={12} className="footer-wrapper">
          <Row className="bg-blue footer">
            <Col md={4}>
              <div
                dangerouslySetInnerHTML={{
                  __html: about,
                }}
              ></div>
            </Col>
            <Col md={4}>
              <div
                dangerouslySetInnerHTML={{
                  __html: contactUs,
                }}
              ></div>
            </Col>
            <Col md={4}>
              <div
                dangerouslySetInnerHTML={{
                  __html: address,
                }}
              ></div>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default Guide;
