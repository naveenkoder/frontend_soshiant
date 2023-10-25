import { InfoCircleTwoTone } from "@ant-design/icons";
import loImgae from "../../../../assets/logout.svg"
export class ChartBuilder {
  result = {};

  /**
   * @param {"gauge" | "pie" | "bar" | "column" | "spline"} type
   */
  setChartType(type) {
    this.result.chart = {
      type: type,
      plotBorderWidth: 0,
      //   plotBackgroundImage: "/dash/gauge-background.png",
    };
  }

  /**
   * @param {string} title
   */
  setTitle(title) {
    this.result.title = {
      text: title,
    };
  }
  /**
   * @param {string} subtitle
   */
  setSubtitle(subtitle) {
    this.result.subtitle = {
      text: subtitle,
    };
  }

  /**
   * @param {boolean} enabled
   */
  setExporting(enabled, options) {
    this.result.exporting = {
      ...options,
      enabled,
    };
  }

  /**
   * @param {boolean} enabled
   * @param {string} pointFormat
   */
  setTooltip(enabled, pointFormat, options) {
    this.result.tooltip = {
      enabled,
      pointFormat,
      ...options,
    };
  }

  /**
   * @param {boolean} enabled
   */
  setCredits(enabled) {
    this.result.credits = {
      enabled,
    };
  }

  /**
   * @param {object} pane
   */
  setPane(pane) {
    this.result.pane = this.result.pane ?? [];
    this.result.pane.push(pane);
  }

  /**
   *
   * @param {string} seriesName
   * @param {Array<string | number>} data
   */
  setSeries(seriesName, data, options = { type: undefined, color: undefined }) {
    this.result.series = this.result.series ?? [];
    this.result.series.push({
      name: seriesName,
      data,
      ...options,
    });
  }

  /**
   * @param {object} option
   */
  setOption(option) {
    this.result = { ...this.result, ...option };
  }

  build() {
    return this.result;
  }
}

export default ChartBuilder;
