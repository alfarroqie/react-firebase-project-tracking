import React, {useEffect } from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
// import * as am4plugins_sliceGrouper from "@amcharts/amcharts4/plugins/sliceGrouper"; 


export default function Chart (data) {
  am4core.options.autoDispose = true;
  am4core.useTheme(am4themes_animated);

  useEffect(() => {
    //set style and data
    let chart = am4core.create("chart"+ data.name, am4charts.PieChart);
    chart.innerRadius = am4core.percent(40);
    chart.data = data.dataChart
    //set value
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = data.name;
    pieSeries.slices.template.stroke = am4core.color("#fff");

    // Disable ticks and labels
    pieSeries.labels.template.disabled = true;
    pieSeries.ticks.template.disabled = true;

    //legend
    chart.legend = new am4charts.Legend();
    chart.legend.fontSize = 14;
    chart.legend.position = "bottom";
    chart.legend.valign = "middle";
    // chart.legend.scrollable = true;
    chart.legend.useDefaultMarker = true;
    var marker = chart.legend.markers.template.children.getIndex(0);
    marker.cornerRadius(12, 12, 12, 12);
    marker.strokeWidth = 2;
    marker.strokeOpacity = 1;
    marker.stroke = am4core.color("#ccc");
  });

  return (
    <>
        <div id={"chart" + data.name} style={{height: "300px" }}></div>
    </>
  );
}