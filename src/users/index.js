import { Button, Layout, theme } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import HeaderComponent from "./components/header";
import Menu from "./components/menu";
import "./style.css";
import Charts from "./components/charts";
const { Header, Content, Footer, Sider } = Layout;
const App = () => {
  const isDesktop = window.innerWidth > 768;
  const [open, setOpen] = useState(isDesktop);
  const {
    token: { colorBgContainer },
  } = theme.useToken({});

  function siderController(state = undefined) {
    if (state === undefined) {
      setOpen(!open);
    } else {
      setOpen(state);
    }
  }

  return (
    <Layout>
      <Sider
        width={open ? (isDesktop ? 300 : "100vw") : 0}
        theme="light"
        style={{
          zIndex: isDesktop ? "auto" : 5,
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <Button onClick={() => siderController()} className="sider-controller">
          <MenuOutlined />
        </Button>
        <Menu siderController={siderController} />
      </Sider>
      <Layout
        className="site-layout"
        style={{
          marginLeft: open ? 300 : 0,
        }}
      >
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            position: "sticky",
            top: 0,
            zIndex: 3,
            width: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <HeaderComponent siderController={siderController} />
        </Header>
        <Content
          style={{
            zIndex: 2,
            margin: isDesktop ? "10px" : "100px 16px 0",
            overflow: "initial",
            padding: 24,
          }}
        >
          <Charts siderController={siderController} />
        </Content>
        <Footer
          style={{
            textAlign: "center",
          }}
        >
          Soshianest ©{new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
  );
};
export default App;
