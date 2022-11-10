const L = {
  log: (...args) => console.log("%c[M4W2FA-bg]", "color: green", ...args),
  warn: (...args) => console.log("%c[M4W2FA-bg]", "color: yellow", ...args),
  debug: (...args) => console.debug("%c[M4W2FA-bg]", "color: gray", ...args),
}
L.debug("bg script running");

function notify(message) {
  L.debug("background script received message");
  browser.notifications.create({
    "type": "basic",
    "iconUrl": browser.extension.getURL("icons/link-48.png"),
    "title": "INTERCEPTED" + message.title,
    "message": message.body
  });
}

/*
Assign `notify()` as a listener to messages from the content script.
*/
browser.runtime.onMessage.addListener(notify);
