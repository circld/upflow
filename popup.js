var background = chrome.extension.getBackgroundPage();
var timeData = background.getTimeData();
var trailing = background.getPeriodSeconds();

d3.select("#timeInfo").text("Down time: " + timeData["downTimeString"] + " out of " + timeData["totalTimeString"] + " total time. ");
d3.select("#blacklisted-site").property("href", document.referrer).text(document.referrer);

var runningTotal = timeData["downTimeSet"];
var timeSeries = new Array(runningTotal);

// calculate running total
for (var i = 0; i < trailing.length; i++) {
  runningTotal -= trailing[i];
  timeSeries[i] = {sec: i, remaining: runningTotal};
}

// chart
// https://bl.ocks.org/mbostock/3883245
// http://jsfiddle.net/cf7a4afv/
// TODO: axes
var margin = {top: 30, right: 10, bottom: 10, left: 10};
var height = 100 - margin.top - margin.bottom;
var width = 250;
var svg = d3.select("#timeSeries").append("svg")
  .attr("width", width)
  .attr("height", height);
var g = svg.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
var x = d3.scaleLinear()
  .domain(d3.extent(timeSeries, function(d) { return d.sec; }))
  .rangeRound([0, width]);
var y = d3.scaleLinear()
  .domain([0, timeData["downTimeSet"]])
  .rangeRound([height, 0]);
var lineChart = d3.line()
  .x(function(d) { return x(d.sec); })
  .y(function(d) { return y(d.remaining); });

g.append("path").attr("d", lineChart(timeSeries))
  .attr("fill", "none")
  .attr("stroke", "#b5f26a")
  .attr("stroke-width", 2);
