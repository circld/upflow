let background = chrome.extension.getBackgroundPage();
let timeData = background.getTimeData();
let trailing = background.getPeriodSeconds();

d3.select("#timeInfo").text("Down time: " + timeData["downTimeString"] + " out of " + timeData["totalTimeString"] + " total time. ");
d3.select("#blacklisted-site").property("href", document.referrer).text(document.referrer);

let runningTotal = timeData["downTimeSet"];
let timeSeries = new Array(runningTotal);

// calculate running total
for (let i = 0; i < trailing.length; i++) {
  runningTotal -= trailing[i];
  timeSeries[i] = {sec: i, remaining: runningTotal};
}

// chart
// https://bl.ocks.org/mbostock/3883245
// http://jsfiddle.net/cf7a4afv/
// TODO: add gradients; color should correspond to downTime
// TODO: plot up to 200 points (take every nth if greater than 200)
// TODO: axes
let margin = {top: 30, right: 10, bottom: 10, left: 10};
let height = 100 - margin.top - margin.bottom;
let width = 250 - margin.left - margin.right;
let svg = d3.select("#timeSeries").append("svg");
let g = svg.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
let x = d3.scaleLinear()
  .domain(d3.extent(timeSeries, function(d) { return d.sec; }))
  .rangeRound([0, width]);
let y = d3.scaleLinear()
  .domain([0, timeData["downTimeSet"]])
  .rangeRound([height, 0]);
let lineChart = d3.line()
  .x(function(d) { return x(d.sec); })
  .y(function(d) { return y(d.remaining); });

g.append("path").attr("d", lineChart(timeSeries))
  .attr("fill", "none")
  .attr("stroke", "#b5f26a")
  .attr("stroke-width", 2);
