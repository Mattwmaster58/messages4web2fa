const L = {
  log: (...args) => console.log("%c[M4W2FA-bg]", "color: green", ...args),
  warn: (...args) => console.log("%c[M4W2FA-bg]", "color: yellow", ...args),
  debug: (...args) => console.debug("%c[M4W2FA-bg]", "color: gray", ...args),
}
L.debug("bg script running");

const TRIGGER_REGEX = /(^|\W)code($|\W)|(^|\W)passcode($|\W)/;
const CODE_REGEX = /\d{5,6}/;
function attempt2FACodeExtraction(messageBody) {
  if (TRIGGER_REGEX.exec(messageBody)) {
    return CODE_REGEX.exec(messageBody)[0]
  }
}

async function receiveNotification(message) {
  L.debug("background script received message: ", message);
  let code = attempt2FACodeExtraction(message.body);
  if (code) {
    const candidateTabs = await browser.tabs.query({active: true, currentWindow: true});
    if (candidateTabs.length) {
      browser.tabs.sendMessage(candidateTabs[0].id, {code}, (resp) => {})
    } else {
      L.warn("no current window active tabs available, not sending message");
    }
  } else {
    L.warn("could not extract code from message notification");
  }
}

/*
Assign `notify()` as a listener to messages from the content script.
*/
browser.runtime.onMessage.addListener(receiveNotification);
