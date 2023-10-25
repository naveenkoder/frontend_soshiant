import React, { useState } from "react";
import {
  Collapse,
  Button,
  CardBody,
  Card,
  Container,
  Row,
  Col,
} from "reactstrap";
import { DownCircleOutlined, UpCircleOutlined } from "@ant-design/icons";
import "./accordion.css";
export const Accordion = (props) => {
  const [isOpen, setIsOpen] = useState(props?.isOpen ? props?.isOpen : false);

  const toggleAccordion = () => setIsOpen(!isOpen);

  return (
    <div>
      <Button
        color="primary"
        onClick={toggleAccordion}
        className="toggle-button"
      >
        <span>{props?.title}</span>
        {isOpen ? <UpCircleOutlined /> : <DownCircleOutlined />}
      </Button>
      <Collapse isOpen={isOpen}>
        <Card>
          <CardBody>
            <Container>
              <Row>
                <Col md={8} className="content-wrapper">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: props?.content?.replace(/\n/gi, "<br>"),
                    }}
                  ></div>
                </Col>
                <Col md={4}>
                  <img src={props?.image} alt="chart-image" />
                </Col>
              </Row>
            </Container>
          </CardBody>
        </Card>
      </Collapse>
    </div>
  );
};

export default Accordion;
