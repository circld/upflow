// hardcoded blacklist
var blacklist = [
  "manga",
  "anime",
  "soccer"
];

function is_blacklisted_factory(blacklist) {

  return function(url) {
    for (var i = 0; i < blacklist.length; i++) {
      if ( url.includes(blacklist[i]) ) {
        return true;
      }
    }
    return false;
  }
}

var is_blacklisted = is_blacklisted_factory(blacklist);

// TODO: send blacklisted URL along to provide link on blocked page
function validate_url(request, sender, sendResponse) {
  var url = request.url;
  var response_action = is_blacklisted(url) ? 'redirect' : 'noop';
  sendResponse({
    action: response_action,
    current_url: url,
    redirect_url: chrome.extension.getURL('keep-growing.html')
  });
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.action === 'url_load') {
      validate_url(request, sender, sendResponse);
    }
  }
);
