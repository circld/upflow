// DONE: access tab url directly (https://developer.chrome.com/extensions/tabs#type-Tab)
// DONE: refactor tick behavior to event-driven behavior
// TODO: add tests
// chai, mocha, sinon-chrome (https://github.com/acvetkov/sinon-chrome)
// TODO: use _ library for times/fill
// TODO: pull all functions out into separate file & import here
// before making logic into an immediately invoked function
// TODO: eslint
// TODO: research sparse array constructs? e.g., [[1, 25], [0, 3221], [1, 354]]
// TODO: detect sleep? update cooldown if big change in clock time
// https://developer.chrome.com/apps/idle

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

// TODO: const for unchanging variables (what about changes in options? will that restart background.js?)
// const upTimeSet = 30;
// const downTimeSet = 20;
const upTimeSet = 40 * 60;
const downTimeSet = 20 * 60;
const totalTime = upTimeSet + downTimeSet;
let downTime = downTimeSet;
let periodSeconds = new Array(totalTime).fill(0);  // literal notation?
let currentTabs;
let downTabs;
let blacklistedInTabs = false;
let redirectPage = chrome.extension.getURL('keep-growing.html')
let isBlacklisted = isBlacklistedFactory(blacklist);

function redirectTabs(tabs) {
  tabs.forEach(tab => chrome.tabs.sendMessage(tab.id,
      {action: 'redirect', currentUrl: tab.url, redirectUrl: redirectPage}
  ));
}

function calcDownTime() {
  let newest = blacklistedInTabs ? 1 : 0;
  let oldest = periodSeconds.shift();
  periodSeconds.push(newest);

  // review this logic...not completely comfortable with it...
  downTime -= downTime > 0 ? newest : 0;
  downTime === 0 ? redirectTabs(downTabs) : 'noop';
  downTime += downTime < downTimeSet ? oldest : 0;
}

function updateState(activeInfo) {
  chrome.tabs.query({active: true}, function(tabs) {
    currentTabs = tabs;
    downTabs = [];
    for (let i = 0, len = currentTabs.length; i < len; i++) {
      if ( isBlacklisted(currentTabs[i].url) ) {
        downTabs.push(currentTabs[i]);
      }
    }

    blacklistedInTabs = downTabs.length > 0 ? true : false;
  });
}

setInterval(calcDownTime, 1000);

// report state

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

// check tabs at startup
updateState({});
// TODO: need listener for window events?
chrome.tabs.onActivated.addListener(updateState);
chrome.tabs.onUpdated.addListener(updateState);
