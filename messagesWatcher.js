const L = {
  log: (...args) => console.log("%c[M4W2FA]", "color: green", ...args),
  warn: (...args) => console.log("%c[M4W2FA]", "color: yellow", ...args),
  debug: (...args) => console.debug("%c[M4W2FA]", "color: gray", ...args),
}
const EVENT_NAME = "M4W2FA";
L.debug("setting window.Notification proxy on M4W chat view");
(function () {
  function notifyHook(title, opt) {
    L.debug("notification recieved", title, opt);
    window.postMessage({
      sender: EVENT_NAME,
      title,
      opt
    });
  }

  const handler = {
    construct(target, args) {
      notifyHook(...args);
      return new target(...args);
    }
  };

  window._Notification = window.Notification;
  window.Notification = new Proxy(Notification, handler);
})();