"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.symbol.iterator");

require("core-js/modules/es.array.filter");

require("core-js/modules/es.array.from");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.function.name");

require("core-js/modules/es.object.get-own-property-descriptor");

require("core-js/modules/es.object.get-prototype-of");

require("core-js/modules/es.object.set-prototype-of");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.reflect.get");

require("core-js/modules/es.regexp.to-string");

require("core-js/modules/es.string.iterator");

require("core-js/modules/es.string.starts-with");

require("core-js/modules/web.dom-collections.iterator");

require("core-js/modules/web.timers");

exports.__esModule = true;
exports.default = void 0;

var _element = require("../../../helpers/dom/element");

var _event = require("../../../helpers/dom/event");

var _array = require("../../../helpers/array");

var _unicode = require("../../../helpers/unicode");

var _object = require("../../../helpers/object");

var C = _interopRequireWildcard(require("../../../i18n/constants"));

var _base = _interopRequireDefault(require("./_base"));

var _constants2 = _interopRequireWildcard(require("../constants"));

var _input = _interopRequireDefault(require("../ui/input"));

var _select = _interopRequireDefault(require("../ui/select"));

var _conditionRegisterer = require("../conditionRegisterer");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * @class ConditionComponent
 * @plugin Filters
 */
var ConditionComponent =
/*#__PURE__*/
function (_BaseComponent) {
  _inherits(ConditionComponent, _BaseComponent);

  function ConditionComponent(hotInstance, options) {
    var _this;

    _classCallCheck(this, ConditionComponent);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ConditionComponent).call(this, hotInstance));
    _this.id = options.id;
    _this.name = options.name;
    _this.addSeparator = options.addSeparator;

    _this.elements.push(new _select.default(_this.hot));

    _this.elements.push(new _input.default(_this.hot, {
      placeholder: C.FILTERS_BUTTONS_PLACEHOLDER_VALUE
    }));

    _this.elements.push(new _input.default(_this.hot, {
      placeholder: C.FILTERS_BUTTONS_PLACEHOLDER_SECOND_VALUE
    }));

    _this.registerHooks();

    return _this;
  }
  /**
   * Register all necessary hooks.
   *
   * @private
   */


  _createClass(ConditionComponent, [{
    key: "registerHooks",
    value: function registerHooks() {
      var _this2 = this;

      this.getSelectElement().addLocalHook('select', function (command) {
        return _this2.onConditionSelect(command);
      });
      this.getSelectElement().addLocalHook('afterClose', function () {
        return _this2.onSelectUIClosed();
      });
      (0, _array.arrayEach)(this.getInputElements(), function (input) {
        input.addLocalHook('keydown', function (event) {
          return _this2.onInputKeyDown(event);
        });
      });
    }
    /**
     * Set state of the component.
     *
     * @param {Object} value State to restore.
     */

  }, {
    key: "setState",
    value: function setState(value) {
      var _this3 = this;

      this.reset();

      if (value) {
        var copyOfCommand = (0, _object.clone)(value.command);

        if (copyOfCommand.name.startsWith(C.FILTERS_CONDITIONS_NAMESPACE)) {
          copyOfCommand.name = this.hot.getTranslatedPhrase(copyOfCommand.name);
        }

        this.getSelectElement().setValue(copyOfCommand);
        (0, _array.arrayEach)(value.args, function (arg, index) {
          if (index > copyOfCommand.inputsCount - 1) {
            return false;
          }

          var element = _this3.getInputElement(index);

          element.setValue(arg);
          element[copyOfCommand.inputsCount > index ? 'show' : 'hide']();

          if (!index) {
            setTimeout(function () {
              return element.focus();
            }, 10);
          }
        });
      }
    }
    /**
     * Export state of the component (get selected filter and filter arguments).
     *
     * @returns {Object} Returns object where `command` key keeps used condition filter and `args` key its arguments.
     */

  }, {
    key: "getState",
    value: function getState() {
      var command = this.getSelectElement().getValue() || (0, _conditionRegisterer.getConditionDescriptor)(_constants2.CONDITION_NONE);
      var args = [];
      (0, _array.arrayEach)(this.getInputElements(), function (element, index) {
        if (command.inputsCount > index) {
          args.push(element.getValue());
        }
      });
      return {
        command: command,
        args: args
      };
    }
    /**
     * Update state of component.
     * @param {Object} condition Object with keys:
     *  * `command` Object, Command object with condition name as `key` property.
     *  * `args` Array, Condition arguments.
     * @param column Physical column index.
     */

  }, {
    key: "updateState",
    value: function updateState(condition, column) {
      var command = condition ? (0, _conditionRegisterer.getConditionDescriptor)(condition.name) : (0, _conditionRegisterer.getConditionDescriptor)(_constants2.CONDITION_NONE);
      this.setCachedState(column, {
        command: command,
        args: condition ? condition.args : []
      });

      if (!condition) {
        (0, _array.arrayEach)(this.getInputElements(), function (element) {
          return element.setValue(null);
        });
      }
    }
    /**
     * Get select element.
     *
     * @returns {SelectUI}
     */

  }, {
    key: "getSelectElement",
    value: function getSelectElement() {
      return this.elements.filter(function (element) {
        return element instanceof _select.default;
      })[0];
    }
    /**
     * Get input element.
     *
     * @param {Number} index Index an array of elements.
     * @returns {InputUI}
     */

  }, {
    key: "getInputElement",
    value: function getInputElement() {
      var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      return this.getInputElements()[index];
    }
    /**
     * Get input elements.
     *
     * @returns {Array}
     */

  }, {
    key: "getInputElements",
    value: function getInputElements() {
      return this.elements.filter(function (element) {
        return element instanceof _input.default;
      });
    }
    /**
     * Get menu object descriptor.
     *
     * @returns {Object}
     */

  }, {
    key: "getMenuItemDescriptor",
    value: function getMenuItemDescriptor() {
      var _this4 = this;

      return {
        key: this.id,
        name: this.name,
        isCommand: false,
        disableSelection: true,
        hidden: function hidden() {
          return _this4.isHidden();
        },
        renderer: function renderer(hot, wrapper, row, col, prop, value) {
          (0, _element.addClass)(wrapper.parentNode, 'htFiltersMenuCondition');

          if (_this4.addSeparator) {
            (0, _element.addClass)(wrapper.parentNode, 'border');
          }

          var label = _this4.hot.rootDocument.createElement('div');

          (0, _element.addClass)(label, 'htFiltersMenuLabel');
          label.textContent = value;
          wrapper.appendChild(label);

          if (!wrapper.parentNode.hasAttribute('ghost-table')) {
            (0, _array.arrayEach)(_this4.elements, function (ui) {
              return wrapper.appendChild(ui.element);
            });
          }

          return wrapper;
        }
      };
    }
    /**
     * Reset elements to their initial state.
     */

  }, {
    key: "reset",
    value: function reset() {
      var _this$hot;

      var lastSelectedColumn = this.hot.getPlugin('filters').getSelectedColumn();
      var visualIndex = lastSelectedColumn && lastSelectedColumn.visualIndex;

      var columnType = (_this$hot = this.hot).getDataType.apply(_this$hot, _toConsumableArray(this.hot.getSelectedLast() || [0, visualIndex]));

      var items = (0, _constants2.default)(columnType);
      (0, _array.arrayEach)(this.getInputElements(), function (element) {
        return element.hide();
      });
      this.getSelectElement().setItems(items);

      _get(_getPrototypeOf(ConditionComponent.prototype), "reset", this).call(this); // Select element as default 'None'


      this.getSelectElement().setValue(items[0]);
    }
    /**
     * On condition select listener.
     *
     * @private
     * @param {Object} command Menu item object (command).
     */

  }, {
    key: "onConditionSelect",
    value: function onConditionSelect(command) {
      (0, _array.arrayEach)(this.getInputElements(), function (element, index) {
        element[command.inputsCount > index ? 'show' : 'hide']();

        if (!index) {
          setTimeout(function () {
            return element.focus();
          }, 10);
        }
      });
      this.runLocalHooks('change', command);
    }
    /**
     * On component SelectUI closed listener.
     *
     * @private
     */

  }, {
    key: "onSelectUIClosed",
    value: function onSelectUIClosed() {
      this.runLocalHooks('afterClose');
    }
    /**
     * Key down listener.
     *
     * @private
     * @param {Event} event DOM event object.
     */

  }, {
    key: "onInputKeyDown",
    value: function onInputKeyDown(event) {
      if ((0, _unicode.isKey)(event.keyCode, 'ENTER')) {
        this.runLocalHooks('accept');
        (0, _event.stopImmediatePropagation)(event);
      } else if ((0, _unicode.isKey)(event.keyCode, 'ESCAPE')) {
        this.runLocalHooks('cancel');
        (0, _event.stopImmediatePropagation)(event);
      }
    }
  }]);

  return ConditionComponent;
}(_base.default);

var _default = ConditionComponent;
exports.default = _default;