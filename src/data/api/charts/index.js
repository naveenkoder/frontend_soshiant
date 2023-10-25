import { AxiosResponse, CancelToken } from "axios";
import APIManager from "../api.service";
import endpoints from "./endpoints.json";

/**
 * An object representing predicted and actual values.
 * @typedef {Object} Response
 * @property {Object} predictValue - The predicted value.
 * @property {number} predictValue.id - The ID of the predicted value.
 * @property {number} predictValue.year - The year of the predicted value.
 * @property {string} predictValue.period - The period of the predicted value.
 * @property {string} predictValue.value - The predicted value in JSON format.
 * @property {string} predictValue.unique_id - The unique ID of the predicted value.
 * @property {number} predictValue.is_real - The flag indicating whether the predicted value is real.
 * @property {Object} actualValue - The actual value.
 * @property {number} actualValue.id - The ID of the actual value.
 * @property {number} actualValue.year - The year of the actual value.
 * @property {string} actualValue.period - The period of the actual value.
 * @property {string} actualValue.value - The actual value in JSON format.
 * @property {string} actualValue.average_accuracy - The average accuracy.
 * @property {string} actualValue.confidence_level - The confidence level.
 * @property {string} actualValue.unique_id - The unique ID of the actual value.
 * @property {number} actualValue.is_real - The flag indicating whether the actual value is real.
 * @property {Object} routeData The route data.
 * @property {number} routeData.id - The ID of the route data.
 * @property {string} routeData.name - The name of the route data.
 * @property {string} routeData.unique_id - The unique ID of the route data.
 * @property {number} routeData.parent - The parent ID of the route data.
 * @property {number} routeData.create_time - The creation time of the route data.
 * @property {number} routeData.modified_time - The modification time of the route data.
 * @property {string} routeData.unit - The unit of the route data.
 * @property {string} routeData.period - The period of the route data.
 * @property {number} routeData.is_active - The flag indicating whether the route data is active.
 * @property {number} routeData.is_deleted - The flag indicating whether the route data is deleted.
 */

/**
 * @typedef {Object} ActualValue
 * @property {number} time
 * @property {number} Actual_value
 * @property {number} Predicted_value
 * @property {number} Accuracy
 * @property {string} Title
 */

/**
 * @param {number} routeId
 * @param {CancelToken} cancelToken
 * @returns {Promise<AxiosResponse<Response, any>>}
 */
export async function getRoutesData(routeId, cancelToken) {
  const response = await APIManager.get(
    endpoints.routesData,
    {
      action: "get_by_id",
      id: routeId,
    },
    cancelToken
  );
  console.log('response', response)
  return response;
}

/**
 * @typedef {Object} ChartInformation
 * @property {string} chartName
 * @property {Object} value
 * @property {string} value.title
 * @property {string} value.description
 */

/**
 * @typedef {Array<ChartInformation>} ChartsData
 */

function decodeBase64(base64) {
  return decodeURIComponent(escape(atob(base64)));
}

/**
 * @param {number} routeId
 * @param {CancelToken} cancelToken
 * @returns {Promise<ChartsData>}
 */
export async function getChartsData(cancelToken) {
  const response = await APIManager.get(
    endpoints.chartsData,
    {
      action: "get_charts_settings",
    },
    cancelToken
  );
  /**
   * @type {ChartsData}
   */
  const value = response.data;
  value.map((i) => {
    i.value = JSON.parse(i.value);
    i.value.title = decodeBase64(i.value?.title || "");
    i.value.description = decodeBase64(i.value?.description || "");
    i.chartName = i.chartName || "";
    return i;
  });
  return value;
}
export async function getNotes(cancelToken) {
  const response = await APIManager.get(
    endpoints.chartsData,
    {
      action: "get_introduction",
    },
    cancelToken
  );
  const value = response.data;
  return value;
}
