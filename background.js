const L = {
  log: (...args) => console.log("%c[M4W2FA-bg]", "color: green", ...args),
  warn: (...args) => console.log("%c[M4W2FA-bg]", "color: yellow", ...args),
  debug: (...args) => console.debug("%c[M4W2FA-bg]", "color: gray", ...args),
};
L.debug("bg script running");

// todo: settings, etc
