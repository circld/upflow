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

var isBlacklisted = isBlacklistedFactory(blacklist);

// TODO: send blacklisted URL along to provide link on blocked page
function validateUrl(request, sender, sendResponse) {
  var url = request.url;
  var responseAction = isBlacklisted(url) ? 'redirect' : 'noop';
  sendResponse({
    action: responseAction,
    currenturl: url,
    redirectUrl: chrome.extension.getURL('keep-growing.html')
  });
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.action === 'urlLoad') {
      validateUrl(request, sender, sendResponse);
    }
  }
);
