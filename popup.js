let background = chrome.extension.getBackgroundPage();
let timeData = background.getTimeData();
let trailing = background.getPeriodSeconds();

// status info
d3.select("#timeInfo").text("Down time: " + timeData["downTimeString"] + " out of " + timeData["totalTimeString"] + " total time. ");
d3.select("#blacklisted-site").property("href", document.referrer).text(document.referrer);

// downTime line chart
let runningTotal = timeData["downTimeSet"];
let timeSeries = new Array(runningTotal);

// calculate running total
for (let i = 0; i < trailing.length; i++) {
  runningTotal -= trailing[i];
  timeSeries[i] = {sec: i, remaining: runningTotal};
}

// https://bl.ocks.org/mbostock/3883245
// http://jsfiddle.net/cf7a4afv/
// DONE: add gradients; color should correspond to downTime
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

// gradients
// http://www.d3noob.org/2013/01/applying-colour-gradient-to-graph-line.html
// htmlcolorcodes.com
var linearGradient = svg.append("linearGradient")
  .attr("id", "line-gradient")
  .attr("gradientUnits", "userSpaceOnUse")
  .attr("x1", 0)
  .attr("y1", y(0))
  .attr("x2", 0)
  .attr("y2", y(timeData["downTimeSet"]));

linearGradient.selectAll("stop")
  .data([{offset: "0%", color: "#371919"}, {offset: "100%", color: "#b5f26a"}])
  .enter().append("stop")
  .attr("offset", function(d) {return d.offset;})
  .attr("stop-color", function(d) {return d.color;});

let lineChart = d3.line()
  .x(function(d) { return x(d.sec); })
  .y(function(d) { return y(d.remaining); });

g.append("path")
  .datum(timeSeries)
  .attr("class", "line")
  .attr("fill", "none")
  .attr("stroke-width", 2)
  .attr("d", lineChart);
