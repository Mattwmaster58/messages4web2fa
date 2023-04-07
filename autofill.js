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
 * @param {HTMLElement} el
 * @param {string} eventName
 * @returns {Event} A normalized event
 */
function normalizeEvent(el, eventName) {
    var ev;
    if (!('KeyboardEvent' in window)) {
        L.error("failed to create KeyboardEvent because the browser doesn't appear to support it");
    }
    ev = new window.KeyboardEvent(eventName, {
        bubbles: true,
        cancelable: false,
    });

    return ev;
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
    el.dispatchEvent(normalizeEvent(el, 'keydown'));
    el.dispatchEvent(normalizeEvent(el, 'keypress'));
    el.dispatchEvent(normalizeEvent(el, 'keyup'));
    el.value !== valueToSet && (el.value = valueToSet);
}

/**
 * Simulate the entry of a value into an element by using events.
 * Dispatches a keydown, keypress, and keyup event, then fires the `input` and `change` events before removing focus.
 * @param {HTMLElement} el
 */
function setValueForElementByEvent(el) {
    const valueToSet = el.value,
        ev1 = el.ownerDocument.createEvent('HTMLEvents'),
        ev2 = el.ownerDocument.createEvent('HTMLEvents');

    el.dispatchEvent(normalizeEvent(el, 'keydown'));
    el.dispatchEvent(normalizeEvent(el, 'keypress'));
    el.dispatchEvent(normalizeEvent(el, 'keyup'));
    ev2.initEvent('input', true, true);
    el.dispatchEvent(ev2);
    ev1.initEvent('change', true, true);
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
    if (!el || (el && 'function' !== typeof el.click)) {
        return false;
    }
    el.click();
    return true;
}