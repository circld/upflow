var background = chrome.extension.getBackgroundPage();
var timeStrings = background.getTimeData();

// d3.select("#downTime").text("Down time: " + toHHMMSS(downTime));
d3.select("#timeInfo").text("Down time: " + timeStrings["downTime"] + " out of " + timeStrings["totalTime"] + " total time. ");
d3.select("#blacklisted-site").property("href", document.referrer).text(document.referrer);
