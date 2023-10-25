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

/**
 * @typedef {Object} PredictValue
 * @property {number} value1
 * @property {number} value2
 * @property {number} value3
 */

import ChartBuilder from "../builders/history.chart.builder";

/**
 * @param {Response} data
 */
export default function AccuracyChartDirector(data, routeName, chartTitle) {
  const chart = new ChartBuilder();
  /**
   * @type { ActualValue[] }
   */
  const allValuesData = JSON.parse(data.actualValue.value);
  /**
   * @type { PredictValue }
   */

  const predictValueData = JSON.parse(data.predictValue.value);
  const predictInfo = JSON.parse(data.predictValue.more_info || "{}");
  const averages = [predictInfo.AVG1, predictInfo.AVG2, predictInfo.AVG3].map(
    (i) => Number(Number(i)?.toFixed(2))
  );
  const confidenceLevels = [
    predictInfo.CL1,
    predictInfo.CL2,
    predictInfo.CL3,
  ].map((i) => Number(Number(i)?.toFixed(2)));
  const actualValue = allValuesData
    .map((i) => parseFloat(i.Actual_value_with_noise ?? i.Actual_value))
    .concat(Object.values(predictValueData))
    .map(Number)
    .map((i) => Number(i?.toFixed(2)))
    .map((i, index) => {
      const y = Number(i?.toFixed(2));
      const predictionIndex = index - allValuesData.length;
      const isPredicted = predictionIndex >= 0;
      const color = isPredicted ? "#009900" : "";
      return {
        y,
        color,
        isPredicted,
        predictionIndex: predictionIndex + 1,
        visible: i !== -1,
        confidenceLevel: confidenceLevels[predictionIndex],
        average: averages[predictionIndex],
      };
    });

  // const predictValue1 = allValuesData
  //   .map((i) => i.Predicted_value_1)
  //   .map(Number)
  //   .map((i, index) => {
  //     const y = Number(i?.toFixed(2));
  //     const predictionIndex = index - allValuesData.length;
  //     const color = predictionIndex < 0 ? "black" : "#009900";
  //     return {
  //       y,
  //       color,
  //       visible: i !== -1,
  //       confidenceLevel: confidenceLevels[predictionIndex],
  //       average: averages[predictionIndex],
  //     };
  //   });

  const predictValue1 = allValuesData
    .map((i) => i.Predicted_value_1)
    .map(Number)
    .map((i) => {
      const y = Number(i?.toFixed(2));
      return {
        y: y,
        visible: y !== -1,
      };
    });
  const predictValue2 = allValuesData
    .map((i) => i.Predicted_value_2)
    .map(Number)
    .map((i) => {
      const y = Number(i?.toFixed(2));
      return {
        y: y,
        visible: y !== -1,
      };
    });
  const predictValue3 = allValuesData
    .map((i) => i.Predicted_value_3)
    .map(Number)
    .map((i) => {
      const y = Number(i?.toFixed(2));
      return {
        y: y,
        visible: y !== -1,
      };
    });

  const predictCategories = Object.keys(predictValueData);

  const categories = allValuesData
    .map((item) => {
      return item?.Title || item?.time || "Unknown";
    })
    .concat(predictCategories);
  chart.setTitle(
    chartTitle ||
      "Validation Period - Forecast vs. Actual Values " + data.routeData.period
  );
  chart.setSubtitle(routeName);
  chart.setCredits(false);

  chart.setSeries("Forecast Lead 1", predictValue1, {
    type: "line",
    color: "#800080",
    showInLegend: true,
    zoneAxis: "x",
    // zones: [
    //   {
    //     value: predictValue1.length - 4,
    //   },
    //   {
    //     dashStyle: "dash",
    //   },
    // ],
  });
  chart.setSeries("Forecast Lead 2", predictValue2, {
    type: "line",
    color: "#008080",
    showInLegend: true,
    zoneAxis: "x",
    // zones: [
    //   {
    //     value: predictValue1.length - 4,
    //   },
    //   {
    //     dashStyle: "dash",
    //   },
    // ],
  });
  chart.setSeries("Forecast Lead 3", predictValue3, {
    type: "line",
    color: "#808000",
    showInLegend: true,
    zoneAxis: "x",
    // zones: [
    //   {
    //     value: predictValue1.length - 4,
    //   },
    //   {
    //     dashStyle: "dash",
    //   },
    // ],
  });

  chart.setOption({
    legend: {
      layout: "horizontal",
      align: "center",
      verticalAlign: "bottom",
    },
  });
  chart.setSeries("Actual Value", actualValue, {
    type: "line",
    color: "#007aff",
    showInLegend: true,
    zoneAxis: "x",
    zones: [
      {
        value: actualValue.length - 4,
      },
      {
        dashStyle: "dash",
      },
    ],
  });
  chart.setSeries("Forecast Value", [], {
    type: "line",
    color: "#009900",
    showInLegend: true,
    zoneAxis: "x",
  });

  chart.setOption({
    yAxis: {
      title: {
        text: data.routeData.unit,
      },
    },
  });

  chart.setOption({
    plotOptions: {
      column: {
        colorByPoint: true,
      },
    },
  });

  chart.setTooltip(true, null, {
    formatter: function () {
      if (!this.point.isPredicted) return `${this.series.name}: ${this.y}`;
      return `Forecast Value ${this.point.predictionIndex}: ${this.y} ${
        this.point.average !== undefined
          ? `<br> Average Accuracy:  ${
              Number.isNaN(this.point.average) ? "N/A" : this.point.average
            } %`
          : ""
      }  ${
        this.point.confidenceLevel !== undefined
          ? `<br> Confidence Level:  ${
              Number.isNaN(this.point.confidenceLevel)
                ? "N/A"
                : this.point.confidenceLevel
            } %`
          : ""
      } `;
    },
  });
  chart.setOption({
    xAxis: {
      tickInterval: 1,
      categories,
    },
  });

  return chart.build();
}
