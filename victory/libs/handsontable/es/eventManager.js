import "core-js/modules/es.array.splice";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

import { polymerWrap, closest } from './helpers/dom/element';
import { hasOwnProperty } from './helpers/object';
import { isWebComponentSupportedNatively, isPassiveEventSupported } from './helpers/feature';
import { stopImmediatePropagation as _stopImmediatePropagation } from './helpers/dom/event';
/**
 * Counter which tracks unregistered listeners (useful for detecting memory leaks).
 *
 * @type {Number}
 */

var listenersCounter = 0;
/**
 * Event DOM manager for internal use in Handsontable.
 *
 * @class EventManager
 * @util
 */

var EventManager =
/*#__PURE__*/
function () {
  /**
   * @param {Object} [context=null]
   * @private
   */
  function EventManager() {
    var context = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    _classCallCheck(this, EventManager);

    this.context = context || this;

    if (!this.context.eventListeners) {
      this.context.eventListeners = [];
    }
  }
  /**
   * Register specified listener (`eventName`) to the element.
   *
   * @param {Element} element Target element.
   * @param {String} eventName Event name.
   * @param {Function} callback Function which will be called after event occur.
   * @param {AddEventListenerOptions|Boolean} [options] Listener options if object or useCapture if boolean.
   * @returns {Function} Returns function which you can easily call to remove that event
   */


  _createClass(EventManager, [{
    key: "addEventListener",
    value: function addEventListener(element, eventName, callback) {
      var _this = this;

      var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      var context = this.context;

      function callbackProxy(event) {
        callback.call(this, extendEvent(context, event));
      }

      if (typeof options !== 'boolean' && !isPassiveEventSupported()) {
        options = false;
      }

      this.context.eventListeners.push({
        element: element,
        event: eventName,
        callback: callback,
        callbackProxy: callbackProxy,
        options: options
      });
      element.addEventListener(eventName, callbackProxy, options);
      listenersCounter += 1;
      return function () {
        _this.removeEventListener(element, eventName, callback);
      };
    }
    /**
     * Remove the event listener previously registered.
     *
     * @param {Element} element Target element.
     * @param {String} eventName Event name.
     * @param {Function} callback Function to remove from the event target. It must be the same as during registration listener.
     */

  }, {
    key: "removeEventListener",
    value: function removeEventListener(element, eventName, callback) {
      var len = this.context.eventListeners.length;
      var tmpEvent;

      while (len) {
        len -= 1;
        tmpEvent = this.context.eventListeners[len];

        if (tmpEvent.event === eventName && tmpEvent.element === element) {
          if (callback && callback !== tmpEvent.callback) {
            /* eslint-disable no-continue */
            continue;
          }

          this.context.eventListeners.splice(len, 1);
          tmpEvent.element.removeEventListener(tmpEvent.event, tmpEvent.callbackProxy, tmpEvent.options);
          listenersCounter -= 1;
        }
      }
    }
    /**
     * Clear all previously registered events.
     *
     * @private
     * @since 0.15.0-beta3
     */

  }, {
    key: "clearEvents",
    value: function clearEvents() {
      if (!this.context) {
        return;
      }

      var len = this.context.eventListeners.length;

      while (len) {
        len -= 1;
        var event = this.context.eventListeners[len];

        if (event) {
          this.removeEventListener(event.element, event.event, event.callback);
        }
      }
    }
    /**
     * Clear all previously registered events.
     */

  }, {
    key: "clear",
    value: function clear() {
      this.clearEvents();
    }
    /**
     * Destroy instance of EventManager.
     */

  }, {
    key: "destroy",
    value: function destroy() {
      this.clearEvents();
      this.context = null;
    }
    /**
     * Trigger event at the specified target element.
     *
     * @param {Element} element Target element.
     * @param {String} eventName Event name.
     */

  }, {
    key: "fireEvent",
    value: function fireEvent(element, eventName) {
      var rootDocument = element.document;
      var rootWindow = element;

      if (!rootDocument) {
        rootDocument = element.ownerDocument ? element.ownerDocument : element;
        rootWindow = rootDocument.defaultView;
      }

      var options = {
        bubbles: true,
        cancelable: eventName !== 'mousemove',
        view: rootWindow,
        detail: 0,
        screenX: 0,
        screenY: 0,
        clientX: 1,
        clientY: 1,
        ctrlKey: false,
        altKey: false,
        shiftKey: false,
        metaKey: false,
        button: 0,
        relatedTarget: undefined
      };
      var event;

      if (rootDocument.createEvent) {
        event = rootDocument.createEvent('MouseEvents');
        event.initMouseEvent(eventName, options.bubbles, options.cancelable, options.view, options.detail, options.screenX, options.screenY, options.clientX, options.clientY, options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, options.relatedTarget || rootDocument.body.parentNode);
      } else {
        event = rootDocument.createEventObject();
      }

      if (element.dispatchEvent) {
        element.dispatchEvent(event);
      } else {
        element.fireEvent("on".concat(eventName), event);
      }
    }
  }]);

  return EventManager;
}();
/**
 * @param {Object} context
 * @param {Event} event
 * @private
 * @returns {*}
 */


function extendEvent(context, event) {
  var componentName = 'HOT-TABLE';
  var isHotTableSpotted;
  var fromElement;
  var realTarget;
  var target;
  var len;
  event.isTargetWebComponent = false;
  event.realTarget = event.target;
  var nativeStopImmediatePropagation = event.stopImmediatePropagation;

  event.stopImmediatePropagation = function () {
    nativeStopImmediatePropagation.apply(this);

    _stopImmediatePropagation(this);
  };

  if (!EventManager.isHotTableEnv) {
    return event;
  } // eslint-disable-next-line no-param-reassign


  event = polymerWrap(event);
  len = event.path ? event.path.length : 0;

  while (len) {
    len -= 1;

    if (event.path[len].nodeName === componentName) {
      isHotTableSpotted = true;
    } else if (isHotTableSpotted && event.path[len].shadowRoot) {
      target = event.path[len];
      break;
    }

    if (len === 0 && !target) {
      target = event.path[len];
    }
  }

  if (!target) {
    target = event.target;
  }

  event.isTargetWebComponent = true;

  if (isWebComponentSupportedNatively()) {
    event.realTarget = event.srcElement || event.toElement;
  } else if (hasOwnProperty(context, 'hot') || context.isHotTableEnv || context.wtTable) {
    // Polymer doesn't support `event.target` property properly we must emulate it ourselves
    if (hasOwnProperty(context, 'hot')) {
      // Custom element
      fromElement = context.hot ? context.hot.view.wt.wtTable.TABLE : null;
    } else if (context.isHotTableEnv) {
      // Handsontable.Core
      fromElement = context.view.activeWt.wtTable.TABLE.parentNode.parentNode;
    } else if (context.wtTable) {
      // Walkontable
      fromElement = context.wtTable.TABLE.parentNode.parentNode;
    }

    realTarget = closest(event.target, [componentName], fromElement);

    if (realTarget) {
      event.realTarget = fromElement.querySelector(componentName) || event.target;
    } else {
      event.realTarget = event.target;
    }
  }

  Object.defineProperty(event, 'target', {
    get: function get() {
      return polymerWrap(target);
    },
    enumerable: true,
    configurable: true
  });
  return event;
}

export default EventManager;
export function getListenersCounter() {
  return listenersCounter;
}