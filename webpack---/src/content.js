var requestList = [];
var responseList = [];
const browser = chrome || browser;
const ALLOW_URL_FILTERS = [
  "://ct.pinterest.com/v3/"
];

const filterRequest = (request) => {
  for (let url of ALLOW_URL_FILTERS) {
    if (request.url.includes(url)) {
      return true;
    }
  }
  return false;
};

browser.runtime.sendMessage({from: 'content'});

browser.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.ping) {
      sendResponse({isInjected: true});
    } else if (request.requestor === "background") {
      if (request.type === "request") {
        if (filterRequest(request.content) && request.content.initiator) {
          requestList.push(request.content);
        }
        sendResponse({eventCount: requestList.length});
        browser.runtime.sendMessage({requestList: requestList});
      } else if(request.type === "response") {
        if (filterRequest(request.content) && request.content.initiator) {
          responseList.push(request.content);
        }
        sendResponse({eventCount: responseList.length});
        browser.runtime.sendMessage({responseList: responseList});
      }
    } else if (request.requestor === "popup") {
        sendResponse({requestList: requestList, responseList: responseList});
    }
  }
);



// WEBPACK FOOTER //
// ./src/content.js