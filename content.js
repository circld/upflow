// TODO: convert everything into camelCase
// TODO: refactor to intercept before even loading the page:
// http://stackoverflow.com/questions/13571110/chrome-extension-how-to-redirect-to-a-custom-html-page-in-response-to-specific
chrome.runtime.sendMessage(
  {action: 'url_load', url: window.location.href},
  function(response) {
    if ( response.action === 'redirect' ) {
      window.location.href = response.redirect_url;
    }
  }
);
