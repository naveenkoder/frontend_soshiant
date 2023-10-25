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
 * @property {Object[]} topTenData
 * @property {number} topTenData.id - ID of the data.
 * @property {number} topTenData.create_time - Time the data was created.
 * @property {string} topTenData.top_ten - Top ten data in JSON string format.
 * @property {string} topTenData.unique_id - Unique ID associated with the data.
 *
 */
import ChartBuilder from "../builders/history.chart.builder";

/**
 * @param {Response} data
 */
export default function TopTenChartDirector(data, routeName, chartTitle) {
  const chart = new ChartBuilder();

  const toptenJson = JSON.parse(data.topTenData.top_ten);
  const topten = [];
  for (const name in toptenJson) {
    topten.push({
      name: name,
      y: Number(parseFloat(toptenJson[name]).toFixed(2)),
      dataLabels: {
        enabled: true,
        format: "{point.y:.1f}%",
      },
    });
  }

  chart.setTitle(chartTitle || "The Most Effective Drivers");
  chart.setSubtitle(routeName);
  chart.setTooltip(true, "<b>{point.percentage:.1f}%</b>");

  chart.setOption({
    colors: [
      "#FF0000",
      "#00FF00",
      "#0000FF",
      "#FFFF00",
      "#FF00FF",
      "#00FFFF",
      "#800000",
      "#008000",
      "#000080",
      "#808000",
      "#800080",
      "#008080",
      "#FFA500",
      "#FFC0CB",
      "#00FF7F",
      "#7B68EE",
      "#B22222",
      "#FF1493",
      "#1E90FF",
      "#FFD700",
    ],
    legend: {
      itemHiddenStyle: {
        display: "none",
      },
      itemStyle: {
        fontSize: "14px",
      },
    },
  });
  chart.setOption({
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: "pie",
      height: 550,
    },
  });
  chart.setOption({
    credits: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "{y}",
        },
        showInLegend: true,
        point: {
          events: {
            legendItemClick: function (e) {
              e.preventDefault();
              return false;
            },
          },
        },
      },
    },
  });

  chart.setSeries("", topten, {
    colorByPoint: true,
  });
  return chart.build();
}
