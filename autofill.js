// lots adopted from bitwarden's autofill.js
// https://github.com/bitwarden/clients/blob/master/apps/browser/src/autofill/content/autofill.js

/**
 * Focus an element and optionally re-set its value after focusing
 * @param {HTMLElement} el
 * @param {boolean} setValue Re-set the value after focusing
 */
function doFocusElement(el, setValue) {
  if (setValue) {
    var existingValue = el.value;
    el.focus();
    el.value !== existingValue && (el.value = existingValue);
  } else {
    el.focus();
  }
}

/**
 * Normalize the event based on API support
 * @param {string} eventName
 * @returns {Event} A normalized event
 */
function createKeyboardEvent(eventName) {
  if (!("KeyboardEvent" in window)) {
    L.error(
      "failed to create KeyboardEvent because the browser doesn't appear to support it!"
    );
    return null;
  }
  return new window.KeyboardEvent(eventName, {
    bubbles: true,
    cancelable: false,
  });
}

/**
 * Simulate the entry of a value into an element.
 * Clicks the element, focuses it, and then fires a keydown, keypress, and keyup event.
 * @param {HTMLElement} el
 */
function setValueForElement(el) {
  const valueToSet = el.value;
  clickElement(el);
  doFocusElement(el, false);
  el.dispatchEvent(createKeyboardEvent("keydown"));
  el.dispatchEvent(createKeyboardEvent("keypress"));
  el.dispatchEvent(createKeyboardEvent("keyup"));
  el.value !== valueToSet && (el.value = valueToSet);
}

/**
 * Simulate the entry of a value into an element by using events.
 * Dispatches a keydown, keypress, and keyup event, then fires the `input` and `change` events before removing focus.
 * @param {HTMLElement} el
 */
function setValueForElementByEvent(el) {
  const valueToSet = el.value,
    ev1 = el.ownerDocument.createEvent("HTMLEvents"),
    ev2 = el.ownerDocument.createEvent("HTMLEvents");

  el.dispatchEvent(createKeyboardEvent("keydown"));
  el.dispatchEvent(createKeyboardEvent("keypress"));
  el.dispatchEvent(createKeyboardEvent("keyup"));
  ev2.initEvent("input", true, true);
  el.dispatchEvent(ev2);
  ev1.initEvent("change", true, true);
  el.dispatchEvent(ev1);
  el.blur();
  el.value !== valueToSet && (el.value = valueToSet);
}

/**
 * Click on an element `el`
 * @param {HTMLElement} el
 * @returns {boolean} Returns true if the element was clicked and false if it was not able to be clicked
 */
function clickElement(el) {
  if (!el || (el && "function" !== typeof el.click)) {
    return false;
  }
  el.click();
  return true;
}

/**
 * Determine if we can apply styling to `el` to indicate that it was filled.
 * @param {HTMLElement} el
 * @returns {boolean} Returns true if we can see the element to apply styling.
 */
function canSeeElementToStyle(el) {
  var currentEl;
  if ((currentEl = animateTheFilling)) {
    a: {
      currentEl = el;
      for (
        var owner = el.ownerDocument,
          owner = owner ? owner.defaultView : {},
          theStyle;
        currentEl && currentEl !== document;

      ) {
        theStyle = owner.getComputedStyle
          ? owner.getComputedStyle(currentEl, null)
          : currentEl.style;
        if (!theStyle) {
          currentEl = true;
          break a;
        }
        if ("none" === theStyle.display || "hidden" == theStyle.visibility) {
          currentEl = false;
          break a;
        }
        currentEl = currentEl.parentNode;
      }
      currentEl = currentEl === document;
    }
  }
  // START MODIFICATION
  if (el && !el.type && el.tagName.toLowerCase() === "span") {
    return true;
  }
  // END MODIFICATION
  if (currentEl) {
    const inputTypes = ["email", "text", "password", "number", "tel", "url"];
    return inputTypes.includes(el.type || "");
  } else {
    return false;
  }
}

function doAllFillOperations(el, afterValSetFunc) {
  setValueForElement(el);
  afterValSetFunc(el);
  setValueForElementByEvent(el);

  // START MODIFICATION
  if (canSeeElementToStyle(el)) {
    el.classList.add("com-m4w2fa-browser-animated-fill");
    setTimeout(function () {
      if (el) el.classList.remove("com-m4w2fa-browser-animated-fill");
    }, styleTimeout);
  }
  // END MODIFICATION
}
