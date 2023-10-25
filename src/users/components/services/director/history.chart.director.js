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
 * @property {number} Actual_value_with_noise
 * @property {number} Predicted_value
 * @property {number} Accuracy
 * @property {string} Title
 */

import ChartBuilder from "../builders/history.chart.builder";

/**
 * @param {Response} data
 */
export default function HistoryChartDirector(data, routeName, chartTitle) {
  const chart = new ChartBuilder();
  /**
   * @type { ActualValue[] }
   */
  const actualValueData = JSON.parse(data.actualValue.value).reverse();
  actualValueData.length = 3;
  const predictValueData = JSON.parse(data.predictValue.value);
  const predictValue = Object.values(predictValueData);
  const predictInfo = JSON.parse(data.predictValue.more_info || "{}");
  const averages = [predictInfo.AVG1, predictInfo.AVG2, predictInfo.AVG3];
  const confidenceLevels = [predictInfo.CL1, predictInfo.CL2, predictInfo.CL3];
  const predictCategory = Object.keys(predictValueData);

  const actualValue = actualValueData
    .reverse()
    .map((item) => item.Actual_value_with_noise ?? item.Actual_value.toString())
    .concat(predictValue)
    .map(Number)
    .map(parseFloat);

  const categories = actualValueData
    .map((item) => item.Title || item.time || "Unknown")
    .concat(predictCategory);

  chart.setTitle(chartTitle || `Three Steps Ahead ${data.routeData.period} Forecast`);
  chart.setSubtitle(routeName);
  chart.setOption({
    yAxis: {
      title: {
        text: data.routeData.unit,
      },
    },
  });

  chart.setChartType("column");

  chart.setOption({
    xAxis: {
      categories,
    },
  });

  chart.setTooltip(true, null, {
    formatter: function () {
      return `${this.point.index < 3 ? "Actual" : "Forecast"} Value: ${
        this.y
      } ${
        this.point.average !== undefined
          ? `<br> Average Accuracy:  ${this.point.average} %`
          : ""
      }  ${
        this.point.confidenceLevel !== undefined
          ? `<br> Confidence Level:  ${this.point.confidenceLevel} %`
          : ""
      } `;
    },
  });
  chart.setSeries(
    routeName,
    actualValue.map((i, index) => {
      const y = Number(Number(i)?.toFixed(2));
      const confidenceLevel = confidenceLevels[index - actualValueData.length];
      const average = averages[index - actualValueData.length];
      let color = index < 3 ? "#007AFF" : "#44D3BA";
      if (confidenceLevel !== undefined) {
        if (confidenceLevel >= 85) {
          color = "rgba(0, 128, 0, 1)";
        } else if (confidenceLevel >= 75) {
          color = "rgba(0, 128, 0, 0.6)";
        } else if (confidenceLevel >= 65) {
          color = "rgba(0, 128, 0, 0.3)";
        } else {
          color = "rgba(255, 126, 0, 0.3)";
        }
      }
      return {
        y: y === -1 ? 0 : y,
        isNA: y === -1,
        color,
        confidenceLevel,
        average,
      };
    }),
    {
      type: "column",
      showInLegend: false,
    }
  );

  chart.setCredits(false);
  chart.setSeries(
    routeName,
    actualValue.map((i, index) => {
      const y = Number(i?.toFixed(2));
      const predictionIndex = index - actualValueData.length
      return {
        color: predictionIndex < 0 ? "black" : "#009900",
        y,
        visible: i !== -1,
        isNA: false,
        confidenceLevel: confidenceLevels[predictionIndex],
        average: averages[predictionIndex],
      };
    }),
    {
      type: "spline",
      showInLegend: false,
      zoneAxis: "x",
      zones: [
        {
          value: 2,
        },
        {
          dashStyle: "dash",
        },
      ],
    }
  );
  chart.setOption({
    plotOptions: {
      column: {
        dataLabels: {
          enabled: true,
          formatter: function () {
            return this.point?.isNA && this.point?.isNA !== undefined
              ? "N/A"
              : "";
          },
        },
      },
    },
  });

  return chart.build();
}
