// TODO: `redirected` implementation is wrong; how to get `keep-growing.html` to
// report state
// hardcoded blacklist
var blacklist = [
  "manga",
  "anime",
  "soccer"
];

function isBlacklistedFactory(blacklist) {

  return function(url) {
    for (var i = 0; i < blacklist.length; i++) {
      if ( url.includes(blacklist[i]) ) {
        return true;
      }
    }
    return false;
  }
}

var upTimeSet = 10;
var downTimeSet = 5;
// var upTimeSet = 40 * 60;
// var downTimeSet = 20 * 60;
var totalTime = upTimeSet + downTimeSet;
var downTime = downTimeSet;
var periodSeconds = new Array(totalTime).fill(0);
var isBlacklisted = isBlacklistedFactory(blacklist);
var redirected = false;

function sumArray(arr) {
  var total = 0;
  for (var i = 0; i < arr.length; i++) {
    total += arr[i];
  }
  return total;
}

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
  redirected = responseAction === 'redirect' ? true : false;
  sendActiveTabMessage({
    action: responseAction,
    currentUrl: url,
    redirectUrl: chrome.extension.getURL('keep-growing.html')
  });
}

// check active tab URL every second
function checkUrl() {
  console.log(downTime);
  if ( redirected ) {
    periodSeconds.push(0);
    downTime += periodSeconds.shift();
    return;
  }
  sendActiveTabMessage({action: "urlCheckAsk", time: downTime, period: periodSeconds});
}
setInterval(checkUrl, 1000);

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if ( request.action === "urlLoad" ) {
      validateUrl(request, sender, sendResponse);
    } else if ( request.action === "urlCheckReply" ) {
      let newest = isBlacklisted(request.url) ? 1 : 0;
      let oldest = periodSeconds.shift();
      periodSeconds.push(newest);

      downTime -= downTime > 0 ? newest : 0;
      downTime += downTime < downTimeSet ? oldest : 0;
      validateUrl(request, sender, sendResponse);
    }
  }
);
