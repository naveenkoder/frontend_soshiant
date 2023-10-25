import ChartBuilder from "../builders/history.chart.builder";
export default function GaugeChartDirector(data, routeName, chartTitle) {
  const chart = new ChartBuilder();
  const actualValueData = JSON.parse(data.actualValue.value).reverse();
  actualValueData.length = 3;
  const predictValue = JSON.parse(data.predictValue.value);
  const actualValue = actualValueData
    .map((item) => item.Actual_value_with_noise ?? item.Actual_value)
    .concat(Object.values(predictValue));
  const current = parseFloat(actualValue[0]);
  const [Prediction1, Prediction2] = Object.values(predictValue);
  const gaugeData = [current, Prediction1, Prediction2].map((i) =>
    Number(Number(i)?.toFixed(2))
  );

  const Average = Number(data.routeData.average) || 0;
  const chartMaxValue =
    parseInt(Math.max(Average, ...gaugeData)) + (Average / 100) * 5;
  // chart.setTitle(`The Most Effective Drivers`);
  chart.setTitle(chartTitle || `${data.routeData.period} Gauge`);
  chart.setSubtitle(`${routeName}`);
  chart.setOption({
    chart: {
      type: "gauge",
      plotBackgroundColor: null,
      plotBackgroundImage: null,
      plotBorderWidth: 0,
      plotShadow: false,
      height: "80%",
    },
  });

  chart.setOption({
    pane: {
      startAngle: -90,
      endAngle: 89.9,
      background: null,
      center: ["50%", "75%"],
      size: "110%",
    },
  });

  chart.setExporting(true);
  chart.setOption({
    yAxis: {
      min: Math.min(Average, ...gaugeData),
      max: chartMaxValue,

      minorTickInterval: "auto",
      minorTickWidth: 1,
      minorTickLength: 10,
      minorTickPosition: "inside",
      minorTickColor: "#666",

      tickPixelInterval: 30,
      tickWidth: 2,
      tickPosition: "inside",
      tickLength: 10,
      tickColor: "#666",
      labels: {
        step: 2,
        rotation: "auto",
      },
      title: {
        text: "Value",
      },
      plotBands: [
        {
          from: 0,
          to: ~~((chartMaxValue / 3) * 1),
          color: "#55BF3B", // green
        },
        {
          from: ~~((chartMaxValue / 3) * 1),
          to: ~~((chartMaxValue / 3) * 2),
          color: "#DDDF0D", // yellow
        },
        {
          from: ~~((chartMaxValue / 3) * 2),
          to: ~~((chartMaxValue / 3) * 3),
          color: "#DF5353", // red
        },
      ],
    },
  });
  chart.setOption({
    yAxis: {
      min: 0,
      max: chartMaxValue,
      tickPixelInterval: 72,
      tickPosition: "inside",
      tickColor: "#FFFFFF",
      tickLength: 20,
      tickWidth: 2,
      minorTickInterval: null,
      labels: {
        distance: 20,
        style: {
          fontSize: "14px",
        },
      },
      lineWidth: 0,
      plotBands: [
        {
          from: 0,
          to: ~~((chartMaxValue / 3) * 1),
          color: "#55BF3B", // green
          thickness: 20,
        },
        {
          from: ~~((chartMaxValue / 3) * 1),
          to: ~~((chartMaxValue / 3) * 2),
          color: "#DDDF0D", // yellow
          thickness: 20,
        },
        {
          from: ~~((chartMaxValue / 3) * 2),
          to: chartMaxValue,
          color: "#DF5353", // red
          thickness: 20,
        },
      ],
    },
  });

  chart.setSeries(
    "Current Value",
    [current].map((i) => Number(Number(i).toFixed(2))),
    {
      visible: current !== -1,
      showInLegend: true,
      dial: {
        backgroundColor: "blue",
      },
    }
  );
  chart.setSeries(
    "Forecast Lead 1",
    [parseFloat(Prediction1)].map((i) => Number(Number(i).toFixed(2))),
    {
      visible: Prediction1 !== -1,
      showInLegend: true,
      dial: {
        backgroundColor: "black",
      },
    }
  );
  chart.setSeries(
    "Forecast Lead 2",
    [parseFloat(Prediction2)].map((i) => Number(Number(i).toFixed(2))),
    {
      visible: Prediction2 !== -1,
      showInLegend: true,
      dial: {
        backgroundColor: "green",
      },
    }
  );
  chart.setSeries(
    "Average Value",
    [parseFloat(Average)].map((i) => Number(Number(i).toFixed(2))),
    {
      visible: Average !== -1,
      showInLegend: true,
      dial: {
        backgroundColor: "orange",
      },
    }
  );

  return chart.build();
}
