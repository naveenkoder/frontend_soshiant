import { useContext } from "react";
import { HistoryContext } from "../contexts/history";
import { useSelectRoute } from "./use-select-route";
import { SelectedFeatureContext } from "../contexts/selectedFeature";

export function useBack() {
  const { pop: popHistory } = useContext(HistoryContext);
  const { value: selectedChart } = useContext(SelectedFeatureContext);
  const select = useSelectRoute();
  return function backButton() {
    const previousPath = popHistory();
    if (previousPath === undefined) return;
    if (String(selectedChart) === String(previousPath)) return backButton();
    select([previousPath], () => {}, { isManually: true });
  };
}
