// TODO: access tab url directly (https://developer.chrome.com/extensions/tabs#type-Tab)
// TODO: use _ library for times/fill
// TODO: pull all functions out into separate file & import here
// before making logic into an immediately invoked function
// TODO: eslint
// TODO: research sparse array constructs? e.g., [[1, 25], [0, 3221], [1, 354]]
// report state
// TODO: refactor tick behavior to event-driven behavior
// refactor to leverage this event to trigger checking of active tab urls for all windows
// chrome.tabs.onActivated.addListener(function() { console.log("change detected"); })

// hardcoded blacklist
var blacklist = [
  "manga",
  "anime",
  "bato.to",
  "soccer"
];

function isBlacklistedFactory(blacklist) {

  return function(url) {
    for (let i = 0, length = blacklist.length; i < length; i++) {
      if ( url.includes(blacklist[i]) ) {
        return true;
      }
    }
    return false;
  }
}

// const for unchanging variables
// let instead of var (not hoisted)
var upTimeSet = 5;
var downTimeSet = 5;
// var upTimeSet = 40 * 60;
// var downTimeSet = 20 * 60;
var totalTime = upTimeSet + downTimeSet;
var downTime = downTimeSet;
var periodSeconds = new Array(totalTime).fill(0);  // literal notation?
var isBlacklisted = isBlacklistedFactory(blacklist);

function isDownTime() {
  return downTime <= 0;
}

function sendActiveTabMessage(message) {
  chrome.tabs.query({active: true}, function(tabs) {
    tabs.forEach(tab => chrome.tabs.sendMessage(tab.id, message));
  });
}

function validateUrl(request, sender, sendResponse) {
  var url = request.url;
  var responseAction = isBlacklisted(url) && isDownTime() ? 'redirect' : 'noop';
  sendActiveTabMessage({
    action: responseAction,
    currentUrl: url,
    redirectUrl: chrome.extension.getURL('keep-growing.html')
  });
}

// check active tab URL every second
function checkUrl() {
  sendActiveTabMessage({action: "urlCheckAsk", time: downTime, period: periodSeconds});
}
setInterval(checkUrl, 1000);

// TODO: pull callback out into functions defined in global scope
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if ( request.action === "urlCheckReply" ) {
      let newest = isBlacklisted(request.url) ? 1 : 0;
      let oldest = periodSeconds.shift();
      periodSeconds.push(newest);

      downTime -= downTime > 0 ? newest : 0;
      downTime += downTime < downTimeSet ? oldest : 0;
    }
    validateUrl(request, sender, sendResponse);
  }
);

// http://stackoverflow.com/questions/6312993/javascript-seconds-to-time-string-with-format-hhmmss
// JS datetime: check to see how intervals are represented/string formatting
// moment.js
function toHHMMSS(seconds) {
    var sec_num = parseInt(seconds, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds;
}

function getTimeData() {
  let downTimeString = toHHMMSS(downTime);
  let totalTimeString = toHHMMSS(totalTime);
  return {
    'downTime': downTime,
    'downTimeSet': downTimeSet,
    'totalTime': totalTime,
    'downTimeString': downTimeString,
    'totalTimeString': totalTimeString
  };
}

// should probably clone array (passed by ref)
function getPeriodSeconds() {
  return periodSeconds;
}
