// TODO: refactor to intercept before even loading the page?
// http://stackoverflow.com/questions/13571110/chrome-extension-how-to-redirect-to-a-custom-html-page-in-response-to-specific

// on new page load
chrome.runtime.sendMessage({action: "urlLoad", url: window.location.href});

// listener for request to check url
chrome.runtime.onMessage.addListener(

  function(request, sender, sendResponse) {
    var currentUrl = window.location.href;
    if ( request.action === "redirect" && request.currentUrl === currentUrl) {
      window.location.href = request.redirectUrl;
    } else if ( request.action === "urlCheckAsk" ) {
      console.log(request);
      chrome.runtime.sendMessage(
          {action: "urlCheckReply", url: window.location.href}
      );
    }
  }

);
