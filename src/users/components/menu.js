import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Tree } from "antd";
import React, { useContext, useEffect, useState } from "react";
import logoImage from "../../assets/logo.png";
import { AccessContext } from "../../contexts/access";
import { RoutesContext } from "../../contexts/routes";
import { SelectedFeatureContext } from "../../contexts/selectedFeature";
import { useSelectRoute } from "../../hooks/use-select-route";
import "./menu.css";
import { tree } from "./services/menu.service";
import { SearchRoute } from "./services/search.service";

const TreeComponent = ({}) => {
  const [treeData, setTreeData] = useState([
    { title: "Features", key: "parent", children: [] },
  ]);
  const selectRoute = useSelectRoute();

  const onSelect = (keys) => selectRoute(keys);
  const [searchText, setSearchText] = useState("");
  const [foundItems, setFoundItems] = useState([]);

  // const [items] = useState(
  const { value: routes } = useContext(RoutesContext);
  const { value: access } = useContext(AccessContext);

  const { value: selectedChart, dispatch: dispatchSelectedChart } = useContext(
    SelectedFeatureContext
  );

  useEffect(() => createTree(routes), [access, routes]);
  useEffect(() => createTree(routes), [0]);
  function createTree(routesData) {
    const data = tree(routesData, access);
    setTreeData(data.children);
  }


  function goToGuide() {
    dispatchSelectedChart("guide");
  }
  function ClearSearch() {
    setSearchText("");
    const found = SearchRoute(routes, "");
    setFoundItems(found);
    createTree(found);
  }

  function search(e) {
    setSearchText(e.target.value);
    const found = SearchRoute(routes, e.target.value);
    setFoundItems(found);
    createTree(found);
  }

  function titleRender(node) {
    const isSelected = selectedChart === node.key;
    const found = node.title
      ?.toLowerCase()
      ?.trim()
      ?.includes(searchText?.toLowerCase()?.trim());
    const className =
      searchText !== "" && found && !isSelected ? "highlighted" : "";
    return (
      <span className={`${className} ${isSelected ? "selected" : ""}`}>
        {node.title}
      </span>
    );
  }

  return (
    <div className="menu">
      <div className="logo">
        <img className="logo-image" src={logoImage} alt="Soshianest Logo" />
      </div>
      <div className="center">
        <div className="center search-input-wrapper">
          <Input
            placeholder="Search..."
            value={searchText}
            onChange={search}
            addonAfter={
              <>
                <Button size="small" onClick={ClearSearch} type="ghost">
                  x
                </Button>
              </>
            }
            prefix={<SearchOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
          />
        </div>
        <div className="guide" onClick={goToGuide}>
          Introduction and User Guide
        </div>
        <div className="tree-wrapper">
          {searchText !== "" ? (
            <Tree
              showLine={true}
              showIcon={false}
              switcherIcon={<i></i>}
              titleRender={titleRender}
              autoExpandParent={true}
              onSelect={onSelect}
              selectedKeys={[]}
              treeData={treeData}
              expandedKeys={foundItems.map((i) => String(i.id)).concat("0")}
            />
          ) : (
            <Tree
              showLine={true}
              showIcon={true}
              autoExpandParent={true}
              expandAction="click"
              defaultExpandedKeys={["0"]}
              titleRender={titleRender}
              onSelect={onSelect}
              selectedKeys={[]}
              treeData={treeData}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TreeComponent;
