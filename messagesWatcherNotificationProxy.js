// script we inject on messages.google.com that proxies the notification, notifying us of new notifications
(function () {
  const L = {
    log: (...args) => console.log("%c[M4W2FA-window]", "color: green", ...args),
    warn: (...args) => console.log("%c[M4W2FA-window]", "color: yellow", ...args),
    debug: (...args) => console.debug("%c[M4W2FA-window]", "color: gray", ...args),
  }
  const EVENT_NAME = "M4W2FA";

  const TRIGGER_REGEX = /(^|\W)code($|\W)|(^|\W)passcode($|\W)/;
  const CODE_REGEX = /\d{5,6}/;

  function attempt2FACodeExtraction(messageBody) {
    if (TRIGGER_REGEX.exec(messageBody)) {
      return CODE_REGEX.exec(messageBody)[0]
    }
  }

  function notifyProxier(target, title, opt) {
    if (opt.body) {
      const code = attempt2FACodeExtraction(opt.body);
      if (code) {
        L.log(`extracted code from body, copying: ${code}`);
        window.postMessage({
          sender: EVENT_NAME,
          command: "copy",
          text: code.toString(),
        });
        return new target("2FA Intercept", {body: `${code} has been copied to your clipboard!`});
      } else {
        L.warn("could not extract code from body");
      }
    }
    L.debug("returning notification contents");
    return new target(title, opt);
  }

  const handler = {
    construct(target, args) {
      // this proxied constructor *must* be synchronous, which means we must do processing on the content page
      const [title, opt] = args;
      L.debug("notification received", title, opt);
      return notifyProxier(target, title, opt);
    }
  };

  L.debug("setting window.Notification proxy");
  window._Notification = window.Notification;
  window.Notification = new Proxy(Notification, handler);
})();
