"use strict";

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.string.iterator");

require("core-js/modules/es.weak-map");

require("core-js/modules/es.weak-set");

require("core-js/modules/web.dom-collections.iterator");

exports.__esModule = true;
exports.createElement = createElement;
exports.deactivateElement = deactivateElement;
exports.destroyElement = destroyElement;

var _eventManager = _interopRequireDefault(require("./../../eventManager"));

var _localHooks = _interopRequireDefault(require("./../../mixins/localHooks"));

var _object = require("./../../helpers/object");

var _browser = require("./../../helpers/browser");

var _element = require("./../../helpers/dom/element");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * @class FocusableWrapper
 *
 * @plugin CopyPaste
 */
var FocusableWrapper =
/*#__PURE__*/
function () {
  function FocusableWrapper(rootDocument) {
    _classCallCheck(this, FocusableWrapper);

    this.rootDocument = rootDocument;
    /**
     * The main/operational focusable element.
     *
     * @type {HTMLElement}
     */

    this.mainElement = null;
    /**
     * Instance of EventManager.
     *
     * @type {EventManager}
     */

    this.eventManager = new _eventManager.default(this);
    /**
     * An object for tracking information about event listeners attached to the focusable element.
     *
     * @type {WeakSet}
     */

    this.listenersCount = new WeakSet();
  }
  /**
   * Switch to the secondary focusable element. Used when no any main focusable element is provided.
   */


  _createClass(FocusableWrapper, [{
    key: "useSecondaryElement",
    value: function useSecondaryElement() {
      var el = createOrGetSecondaryElement(this.rootDocument);

      if (!this.listenersCount.has(el)) {
        this.listenersCount.add(el);
        forwardEventsToLocalHooks(this.eventManager, el, this);
      }

      this.mainElement = el;
    }
    /**
     * Switch to the main focusable element.
     */

  }, {
    key: "setFocusableElement",
    value: function setFocusableElement(element) {
      if (!this.listenersCount.has(element)) {
        this.listenersCount.add(element);
        forwardEventsToLocalHooks(this.eventManager, element, this);
      }

      this.mainElement = element;
    }
    /**
     * Get currently set focusable element.
     *
     * @return {HTMLElement}
     */

  }, {
    key: "getFocusableElement",
    value: function getFocusableElement() {
      return this.mainElement;
    }
    /**
     * Set focus to the focusable element.
     */

  }, {
    key: "focus",
    value: function focus() {
      // Add an empty space to texarea. It is necessary for safari to enable "copy" command from menu bar.
      this.mainElement.value = ' ';

      if (!(0, _browser.isMobileBrowser)()) {
        (0, _element.selectElementIfAllowed)(this.mainElement);
      }
    }
  }]);

  return FocusableWrapper;
}();

(0, _object.mixin)(FocusableWrapper, _localHooks.default);
var refCounter = 0;
/**
 * Create and return the FocusableWrapper instance.
 *
 * @return {FocusableWrapper}
 */

function createElement(rootDocument) {
  var focusableWrapper = new FocusableWrapper(rootDocument);
  refCounter += 1;
  return focusableWrapper;
}
/**
 * Deactivate the FocusableWrapper instance.
 *
 * @param {FocusableWrapper} wrapper
 */


function deactivateElement(wrapper) {
  wrapper.eventManager.clear();
}

var runLocalHooks = function runLocalHooks(eventName, subject) {
  return function (event) {
    return subject.runLocalHooks(eventName, event);
  };
};
/**
 * Register copy/cut/paste events and forward their actions to the subject local hooks system.
 *
 * @param {HTMLElement} element
 * @param {FocusableWrapper} subject
 */


function forwardEventsToLocalHooks(eventManager, element, subject) {
  eventManager.addEventListener(element, 'copy', runLocalHooks('copy', subject));
  eventManager.addEventListener(element, 'cut', runLocalHooks('cut', subject));
  eventManager.addEventListener(element, 'paste', runLocalHooks('paste', subject));
}

var secondaryElements = new WeakMap();
/**
 * Create and attach newly created focusable element to the DOM.
 *
 * @return {HTMLElement}
 */

function createOrGetSecondaryElement(rootDocument) {
  var secondaryElement = secondaryElements.get(rootDocument);

  if (secondaryElement) {
    if (!secondaryElement.parentElement) {
      this.rootDocument.body.appendChild(secondaryElement);
    }

    return secondaryElement;
  }

  var element = rootDocument.createElement('textarea');
  secondaryElements.set(rootDocument, element);
  element.id = 'HandsontableCopyPaste';
  element.className = 'copyPaste';
  element.tabIndex = -1;
  element.autocomplete = 'off';
  element.wrap = 'hard';
  element.value = ' ';
  rootDocument.body.appendChild(element);
  return element;
}
/**
 * Destroy the FocusableWrapper instance.
 *
 * @param {FocusableWrapper} wrapper
 */


function destroyElement(wrapper) {
  if (!(wrapper instanceof FocusableWrapper)) {
    return;
  }

  if (refCounter > 0) {
    refCounter -= 1;
  }

  deactivateElement(wrapper);

  if (refCounter <= 0) {
    refCounter = 0; // Detach secondary element from the DOM.

    var secondaryElement = secondaryElements.get(wrapper.rootDocument);

    if (secondaryElement && secondaryElement.parentNode) {
      secondaryElement.parentNode.removeChild(secondaryElement);
      secondaryElements.delete(wrapper.rootDocument);
    }

    wrapper.mainElement = null;
  }
}