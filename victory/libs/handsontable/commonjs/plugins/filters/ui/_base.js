"use strict";

require("core-js/modules/es.object.get-own-property-descriptor");

require("core-js/modules/es.string.starts-with");

exports.__esModule = true;
exports.default = void 0;

var _object = require("../../../helpers/object");

var _localHooks = _interopRequireDefault(require("../../../mixins/localHooks"));

var _eventManager = _interopRequireDefault(require("../../../eventManager"));

var _element = require("../../../helpers/dom/element");

var _array = require("../../../helpers/array");

var C = _interopRequireWildcard(require("../../../i18n/constants"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var STATE_BUILT = 'built';
var STATE_BUILDING = 'building';
var EVENTS_TO_REGISTER = ['click', 'input', 'keydown', 'keypress', 'keyup', 'focus', 'blur', 'change'];
/**
 * @class
 * @private
 */

var BaseUI =
/*#__PURE__*/
function () {
  _createClass(BaseUI, null, [{
    key: "DEFAULTS",
    get: function get() {
      return (0, _object.clone)({
        className: '',
        value: '',
        tagName: 'div',
        children: [],
        wrapIt: true
      });
    }
  }]);

  function BaseUI(hotInstance, options) {
    _classCallCheck(this, BaseUI);

    /**
     * Instance of Handsontable.
     *
     * @type {Core}
     */
    this.hot = hotInstance;
    /**
     * Instance of EventManager.
     *
     * @type {EventManager}
     */

    this.eventManager = new _eventManager.default(this);
    /**
     * List of element options.
     *
     * @type {Object}
     */

    this.options = (0, _object.extend)(BaseUI.DEFAULTS, options);
    /**
     * Build root DOM element.
     *
     * @type {Element}
     * @private
     */

    this._element = this.hot.rootDocument.createElement(this.options.wrapIt ? 'div' : this.options.tagName);
    /**
     * Flag which determines build state of element.
     *
     * @type {Boolean}
     */

    this.buildState = false;
  }
  /**
   * Set the element value.
   *
   * @returns {*}
   */


  _createClass(BaseUI, [{
    key: "setValue",
    value: function setValue(value) {
      this.options.value = value;
      this.update();
    }
    /**
     * Get the element value.
     *
     * @returns {*}
     */

  }, {
    key: "getValue",
    value: function getValue() {
      return this.options.value;
    }
    /**
     * Get element as a DOM object.
     *
     * @returns {Element}
     */

  }, {
    key: "isBuilt",

    /**
     * Check if element was built (built whole DOM structure).
     *
     * @returns {Boolean}
     */
    value: function isBuilt() {
      return this.buildState === STATE_BUILT;
    }
    /**
     * Translate value if it is possible. It's checked if value belongs to namespace of translated phrases.
     *
     * @param {*} value Value which will may be translated.
     * @returns {*} Translated value if translation was possible, original value otherwise.
     */

  }, {
    key: "translateIfPossible",
    value: function translateIfPossible(value) {
      if (typeof value === 'string' && value.startsWith(C.FILTERS_NAMESPACE)) {
        return this.hot.getTranslatedPhrase(value);
      }

      return value;
    }
    /**
     * Build DOM structure.
     */

  }, {
    key: "build",
    value: function build() {
      var _this = this;

      var registerEvent = function registerEvent(element, eventName) {
        _this.eventManager.addEventListener(element, eventName, function (event) {
          return _this.runLocalHooks(eventName, event, _this);
        });
      };

      if (!this.buildState) {
        this.buildState = STATE_BUILDING;
      }

      if (this.options.className) {
        (0, _element.addClass)(this._element, this.options.className);
      }

      if (this.options.children.length) {
        (0, _array.arrayEach)(this.options.children, function (element) {
          return _this._element.appendChild(element.element);
        });
      } else if (this.options.wrapIt) {
        var element = this.hot.rootDocument.createElement(this.options.tagName);
        (0, _object.objectEach)(this.options, function (value, key) {
          if (element[key] !== void 0 && key !== 'className' && key !== 'tagName' && key !== 'children') {
            element[key] = _this.translateIfPossible(value);
          }
        });

        this._element.appendChild(element);

        (0, _array.arrayEach)(EVENTS_TO_REGISTER, function (eventName) {
          return registerEvent(element, eventName);
        });
      } else {
        (0, _array.arrayEach)(EVENTS_TO_REGISTER, function (eventName) {
          return registerEvent(_this._element, eventName);
        });
      }
    }
    /**
     * Update DOM structure.
     */

  }, {
    key: "update",
    value: function update() {}
    /**
     * Reset to initial state.
     */

  }, {
    key: "reset",
    value: function reset() {
      this.options.value = '';
      this.update();
    }
    /**
     * Show element.
     */

  }, {
    key: "show",
    value: function show() {
      this.element.style.display = '';
    }
    /**
     * Hide element.
     */

  }, {
    key: "hide",
    value: function hide() {
      this.element.style.display = 'none';
    }
    /**
     * Focus element.
     */

  }, {
    key: "focus",
    value: function focus() {}
  }, {
    key: "destroy",
    value: function destroy() {
      this.eventManager.destroy();
      this.eventManager = null;
      this.hot = null;

      if (this._element.parentNode) {
        this._element.parentNode.removeChild(this._element);
      }

      this._element = null;
    }
  }, {
    key: "element",
    get: function get() {
      if (this.buildState === STATE_BUILDING) {
        return this._element;
      }

      if (this.buildState === STATE_BUILT) {
        this.update();
        return this._element;
      }

      this.buildState = STATE_BUILDING;
      this.build();
      this.buildState = STATE_BUILT;
      return this._element;
    }
  }]);

  return BaseUI;
}();

(0, _object.mixin)(BaseUI, _localHooks.default);
var _default = BaseUI;
exports.default = _default;