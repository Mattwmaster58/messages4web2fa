// ==UserScript==
// @name        New script - google.com
// @namespace   Violentmonkey Scripts
// @match       https://messages.google.com/web/*
// @grant       none
// @version     1.0
// @author      -
// @grant       unsafeWindow
// @run-at      document-start
// @description 11/2/2022, 12:33:49 AM
// ==/UserScript==


function log(...args) {
  return console.log("%c[M4W2FA]", "color: green", ...args]);
}

function warn(...args) {
  return console.log(["%c[M4W2FA]", "color: yellow", ...args]);
}

log("setting window.Notification proxy obj");
(function () {

  function notificationCallback(title, opt) {
    console.log("title", title);
  }

  const handler = {
    construct(target, args) {
      notificationCallback(...args);
      return new target(...args);
    }
  };

  const ProxifiedNotification = new Proxy(Notification, handler);

  unsafeWindow.Notification = ProxifiedNotification;
})();

Notification.requestPermission(function (permission) {
  if (permission === "granted") {
    const notif = new Notification('My title');
  }
});