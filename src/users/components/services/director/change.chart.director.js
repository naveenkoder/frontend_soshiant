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

function calculateChanges(numbers) {
  const changes = [];
  let previousNumber = null;
  for (let i = 0; i < numbers.length; i++) {
    const currentNumber = numbers[i];
    if (previousNumber === null) {
      previousNumber = currentNumber;
      continue;
    }

    if (currentNumber === -1 || previousNumber === -1) {
      // Exception: Assign 0 and continue
      changes.push(NaN);
      previousNumber = currentNumber;
      continue;
    }

    // const max = Math.max(currentNumber, previousNumber);
    const percentChange = ((currentNumber - previousNumber) / previousNumber) * 100;
    changes.push(Number(Number(percentChange).toFixed(2)));
    previousNumber = currentNumber;
  }

  return changes;
}

/**
 * @param {Response} data
 */
export default function ChangeChartDirector(data, routeName, chartTitle) {
  const chart = new ChartBuilder();
  /**
   * @type { ActualValue[] }
   */
  const actualValueData = JSON.parse(data.actualValue.value).reverse();
  const predictValue = JSON.parse(data.predictValue.value);
  const predictCategory = Object.keys(predictValue);
  actualValueData.length = 4;
  const actualValue = actualValueData
    .map((item) => item.Actual_value_with_noise ?? item.Actual_value)
    .reverse()
    .concat(Object.values(predictValue));

  const result = calculateChanges(actualValue);
  const categories = actualValueData
    .map((i) => {
      return i?.Title || i?.time || "Unknown";
    })
    .reverse()
    .concat(predictCategory);

  chart.setTitle(
    chartTitle || "Normalized " + data.routeData.period + ` Percentage Changes of Freight Rate Values`
  );
  chart.setSubtitle(routeName);
  chart.setOption({
    yAxis: {
      title: {
        text: "%",
      },
    },
  });

  chart.setTooltip(false);

  // chart.setTooltip(true, null, {
  //   formatter: function () {
  //     const cat = [...categories];
  //     return `${cat[this.point.index]}-${cat[this.point.index+1]} <br> changes: ${this.point.y}%`;
  //     return `${this.point.index < 3 ? "Actual" : "Predicted"} Value: ${
  //       this.y
  //     } ${
  //       this.point.average !== undefined
  //         ? `<br> Average Accuracy:  ${this.point.average} %`
  //         : ""
  //     }  ${
  //       this.point.confidenceLevel !== undefined
  //         ? `<br> Confidence Level:  ${this.point.confidenceLevel} %`
  //         : ""
  //     } `;
  //   },
  // });

  chart.setChartType("column");
  categories.shift();
  chart.setOption({
    xAxis: {
      categories: categories,
    },
  });

  chart.setOption({
    plotOptions: {
      column: {
        dataLabels: {
          enabled: true,
          formatter: function () {
            return this.point.isNA ? "N/A" : `${this.point.y}%`;
          },
        },
      },
    },
  });

  const series = result
    .map((i) => Number(i?.toFixed(2)))
    .map((i, index) => ({
      y: Number.isNaN(i) ? 0 : i,
      isNA: Number.isNaN(i),
      color: index < 3 ? "#5856D6" : "#10BD74",
    }));
  chart.setCredits(false);
  chart.setSeries(routeName, series, {
    type: "column",
    showInLegend: false,
  });
  return chart.build();
}
