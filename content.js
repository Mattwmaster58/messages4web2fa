// this runs at the page level, but in an isolated world
const L = {
  log: (...args) => console.log("%c[M4W2FA]", "color: green", ...args),
  warn: (...args) => console.log("%c[M4W2FA]", "color: yellow", ...args),
  debug: (...args) => console.debug("%c[M4W2FA]", "color: gray", ...args),
};
const EVENT_NAME = "M4W2FA";

if (location.href.startsWith("https://messages.google.com/web")) {
  const injected = document.createElement("script");
  injected.src = browser.runtime.getURL("messagesWatcherNotificationProxy.js");
  L.debug(`injected ${injected.src} into page`);
  injected.onload = function () {
    this.remove();
  };
  (document.head || document.documentElement).appendChild(injected);
  window.addEventListener("message", (e) => {
    if (e.data.sender !== EVENT_NAME || e.data.command !== "copy") {
      L.warn("post message not for us", e.data);
    } else {
      copyText(e.data.text);
    }
  });
}

// https://stackoverflow.com/questions/60348917/copy-text-to-clipboard-when-a-chrome-extension-s-browser-action-is-clicked
function copyText(text) {
  const ta = document.createElement("textarea");
  ta.style.cssText =
    "opacity:0; position:fixed; width:1px; height:1px; top:0; left:0;";
  ta.value = text;
  ta.id = EVENT_NAME;
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  document.execCommand("copy");
  ta.remove();
}
