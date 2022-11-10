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
  L.debug(`injected ${injected.src} into page`);
  injected.onload = function() {this.remove()};
  (document.head || document.documentElement).appendChild(injected);
  window.addEventListener("message", (e) => {
    if (e.data.sender !== EVENT_NAME) {
      L.warn("post message not for us", e.data);
    } else {
      L.debug("received notif post message, passing to browser");
      browser.runtime.sendMessage({title: e.data.title, body: e.data.opt.body});
    }
  })
}
