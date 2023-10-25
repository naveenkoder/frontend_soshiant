import { useNavigate } from "react-router-dom";
import { HistoryContext } from "../contexts/history";
import { useContext } from "react";
import { SelectedFeatureContext } from "../contexts/selectedFeature";

export function useSelectRoute() {
  const { value: selectedChart, dispatch: dispatchSelectedChart } = useContext(
    SelectedFeatureContext
  );
  const { push: pushHistory } = useContext(HistoryContext);
  const navigate = useNavigate();
  return function (keys, cb = () => {}, options = { isManually: false }) {
    const [selectedKey] = keys;
    if (String(selectedChart) === String(selectedKey)) return;
    if (options.isManually !== true) pushHistory(selectedKey);
    navigate(`/page/${selectedKey}`, {
      replace: true,
    });
    dispatchSelectedChart(selectedKey);
    cb();
    //   setSelectedKeys([selectedKey]);
  };
}
