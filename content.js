const L = {
  log: (...args) => console.log("%c[M4W2FA]", "color: green", ...args),
  warn: (...args) => console.log("%c[M4W2FA]", "color: yellow", ...args),
  debug: (...args) => console.debug("%c[M4W2FA]", "color: gray", ...args),
}
const EVENT_NAME = "M4W2FA";

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
} else {
  L.log("awaiting possible code delivery");
  function codeListener(codeMsg) {
    copy(codeMsg.code);
    L.log(`copied code: ${codeMsg.code}`);
  }
  browser.runtime.onMessage.addListener(codeListener)
}

// https://stackoverflow.com/questions/60348917/copy-text-to-clipboard-when-a-chrome-extension-s-browser-action-is-clicked
function copy(text) {
  const ta = document.createElement('textarea');
  ta.style.cssText = 'opacity:0; position:fixed; width:1px; height:1px; top:0; left:0;';
  ta.value = text;
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  document.execCommand('copy');
  ta.remove();
}