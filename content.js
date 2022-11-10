const L = {
  log: (...args) => console.log("%c[M4W2FA]", "color: green", ...args),
  warn: (...args) => console.log("%c[M4W2FA]", "color: yellow", ...args),
  debug: (...args) => console.debug("%c[M4W2FA]", "color: gray", ...args),
}
const EVENT_NAME = "M4W2FA";
L.debug("running");
if (location.href.startsWith("https://messages.google.com/web")) {
  const injected = document.createElement('script');
  injected.src = browser.runtime.getURL('messagesWatcher.js');
  injected.onload = function() {this.remove()};
  (document.head || document.documentElement).appendChild(injected);
  window.addEventListener("message", (e) => {
    if (e.data.sender !== EVENT_NAME) {
      L.warn("post message not for us", e.data);
    } else {
      L.debug("recieved notif post message, passing to browser");
      browser.runtime.sendMessage({"notification details": {title, opt}});
    }
  })
}
