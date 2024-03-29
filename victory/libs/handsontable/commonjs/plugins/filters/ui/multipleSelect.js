"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.symbol.iterator");

require("core-js/modules/es.array.from");

require("core-js/modules/es.array.index-of");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.object.get-own-property-descriptor");

require("core-js/modules/es.object.get-prototype-of");

require("core-js/modules/es.object.set-prototype-of");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.reflect.get");

require("core-js/modules/es.regexp.to-string");

require("core-js/modules/es.string.iterator");

require("core-js/modules/es.weak-map");

require("core-js/modules/web.dom-collections.iterator");

require("core-js/modules/web.timers");

exports.__esModule = true;
exports.default = void 0;

var _element = require("../../../helpers/dom/element");

var _object = require("../../../helpers/object");

var _array = require("../../../helpers/array");

var _unicode = require("../../../helpers/unicode");

var _function = require("../../../helpers/function");

var C = _interopRequireWildcard(require("../../../i18n/constants"));

var _event = require("../../../helpers/dom/event");

var _base = _interopRequireDefault(require("./_base"));

var _input = _interopRequireDefault(require("./input"));

var _link = _interopRequireDefault(require("./link"));

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var privatePool = new WeakMap();
/**
 * @class MultipleSelectUI
 * @util
 */

var MultipleSelectUI =
/*#__PURE__*/
function (_BaseUI) {
  _inherits(MultipleSelectUI, _BaseUI);

  _createClass(MultipleSelectUI, null, [{
    key: "DEFAULTS",
    get: function get() {
      return (0, _object.clone)({
        className: 'htUIMultipleSelect',
        value: []
      });
    }
  }]);

  function MultipleSelectUI(hotInstance, options) {
    var _this;

    _classCallCheck(this, MultipleSelectUI);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(MultipleSelectUI).call(this, hotInstance, (0, _object.extend)(MultipleSelectUI.DEFAULTS, options)));
    privatePool.set(_assertThisInitialized(_this), {});
    /**
     * Input element.
     *
     * @type {InputUI}
     */

    _this.searchInput = new _input.default(_this.hot, {
      placeholder: C.FILTERS_BUTTONS_PLACEHOLDER_SEARCH,
      className: 'htUIMultipleSelectSearch'
    });
    /**
     * "Select all" UI element.
     *
     * @type {BaseUI}
     */

    _this.selectAllUI = new _link.default(_this.hot, {
      textContent: C.FILTERS_BUTTONS_SELECT_ALL,
      className: 'htUISelectAll'
    });
    /**
     * "Clear" UI element.
     *
     * @type {BaseUI}
     */

    _this.clearAllUI = new _link.default(_this.hot, {
      textContent: C.FILTERS_BUTTONS_CLEAR,
      className: 'htUIClearAll'
    });
    /**
     * List of available select options.
     *
     * @type {Array}
     */

    _this.items = [];
    /**
     * Handsontable instance used as items list element.
     *
     * @type {Handsontable}
     */

    _this.itemsBox = null;

    _this.registerHooks();

    return _this;
  }
  /**
   * Register all necessary hooks.
   */


  _createClass(MultipleSelectUI, [{
    key: "registerHooks",
    value: function registerHooks() {
      var _this2 = this;

      this.searchInput.addLocalHook('keydown', function (event) {
        return _this2.onInputKeyDown(event);
      });
      this.searchInput.addLocalHook('input', function (event) {
        return _this2.onInput(event);
      });
      this.selectAllUI.addLocalHook('click', function (event) {
        return _this2.onSelectAllClick(event);
      });
      this.clearAllUI.addLocalHook('click', function (event) {
        return _this2.onClearAllClick(event);
      });
    }
    /**
     * Set available options.
     *
     * @param {Array} items Array of objects with `checked` and `label` property.
     */

  }, {
    key: "setItems",
    value: function setItems(items) {
      this.items = items;

      if (this.itemsBox) {
        this.itemsBox.loadData(this.items);
      }
    }
    /**
     * Get all available options.
     *
     * @returns {Array}
     */

  }, {
    key: "getItems",
    value: function getItems() {
      return _toConsumableArray(this.items);
    }
    /**
     * Get element value.
     *
     * @returns {Array} Array of selected values.
     */

  }, {
    key: "getValue",
    value: function getValue() {
      return itemsToValue(this.items);
    }
    /**
     * Check if all values listed in element are selected.
     *
     * @returns {Boolean}
     */

  }, {
    key: "isSelectedAllValues",
    value: function isSelectedAllValues() {
      return this.items.length === this.getValue().length;
    }
    /**
     * Build DOM structure.
     */

  }, {
    key: "build",
    value: function build() {
      var _this3 = this;

      _get(_getPrototypeOf(MultipleSelectUI.prototype), "build", this).call(this);

      var rootDocument = this.hot.rootDocument;
      var itemsBoxWrapper = rootDocument.createElement('div');
      var selectionControl = new _base.default(this.hot, {
        className: 'htUISelectionControls',
        children: [this.selectAllUI, this.clearAllUI]
      });

      this._element.appendChild(this.searchInput.element);

      this._element.appendChild(selectionControl.element);

      this._element.appendChild(itemsBoxWrapper);

      var hotInitializer = function hotInitializer(wrapper) {
        if (!_this3._element) {
          return;
        }

        if (_this3.itemsBox) {
          _this3.itemsBox.destroy();
        }

        (0, _element.addClass)(wrapper, 'htUIMultipleSelectHot'); // Construct and initialise a new Handsontable

        _this3.itemsBox = new _this3.hot.constructor(wrapper, {
          data: _this3.items,
          columns: [{
            data: 'checked',
            type: 'checkbox',
            label: {
              property: 'visualValue',
              position: 'after'
            }
          }],
          beforeRenderer: function beforeRenderer(TD, row, col, prop, value, cellProperties) {
            TD.title = cellProperties.instance.getDataAtRowProp(row, cellProperties.label.property);
          },
          autoWrapCol: true,
          height: 110,
          // Workaround for #151.
          colWidths: function colWidths() {
            return _this3.itemsBox.container.scrollWidth - (0, _element.getScrollbarWidth)(rootDocument);
          },
          copyPaste: false,
          disableVisualSelection: 'area',
          fillHandle: false,
          fragmentSelection: 'cell',
          tabMoves: {
            row: 1,
            col: 0
          },
          beforeKeyDown: function beforeKeyDown(event) {
            return _this3.onItemsBoxBeforeKeyDown(event);
          }
        });

        _this3.itemsBox.init();
      };

      hotInitializer(itemsBoxWrapper);
      setTimeout(function () {
        return hotInitializer(itemsBoxWrapper);
      }, 100);
    }
    /**
     * Reset DOM structure.
     */

  }, {
    key: "reset",
    value: function reset() {
      this.searchInput.reset();
      this.selectAllUI.reset();
      this.clearAllUI.reset();
    }
    /**
     * Update DOM structure.
     */

  }, {
    key: "update",
    value: function update() {
      if (!this.isBuilt()) {
        return;
      }

      this.itemsBox.loadData(valueToItems(this.items, this.options.value));

      _get(_getPrototypeOf(MultipleSelectUI.prototype), "update", this).call(this);
    }
    /**
     * Destroy instance.
     */

  }, {
    key: "destroy",
    value: function destroy() {
      if (this.itemsBox) {
        this.itemsBox.destroy();
      }

      this.searchInput.destroy();
      this.clearAllUI.destroy();
      this.selectAllUI.destroy();
      this.searchInput = null;
      this.clearAllUI = null;
      this.selectAllUI = null;
      this.itemsBox = null;
      this.items = null;

      _get(_getPrototypeOf(MultipleSelectUI.prototype), "destroy", this).call(this);
    }
    /**
     * 'input' event listener for input element.
     *
     * @private
     * @param {Event} event DOM event.
     */

  }, {
    key: "onInput",
    value: function onInput(event) {
      var value = event.target.value.toLowerCase();
      var filteredItems;

      if (value === '') {
        filteredItems = _toConsumableArray(this.items);
      } else {
        filteredItems = (0, _array.arrayFilter)(this.items, function (item) {
          return "".concat(item.value).toLowerCase().indexOf(value) >= 0;
        });
      }

      this.itemsBox.loadData(filteredItems);
    }
    /**
     * 'keydown' event listener for input element.
     *
     * @private
     * @param {Event} event DOM event.
     */

  }, {
    key: "onInputKeyDown",
    value: function onInputKeyDown(event) {
      this.runLocalHooks('keydown', event, this);
      var isKeyCode = (0, _function.partial)(_unicode.isKey, event.keyCode);

      if (isKeyCode('ARROW_DOWN|TAB') && !this.itemsBox.isListening()) {
        (0, _event.stopImmediatePropagation)(event);
        this.itemsBox.listen();
        this.itemsBox.selectCell(0, 0);
      }
    }
    /**
     * On before key down listener (internal Handsontable).
     *
     * @private
     * @param {Event} event DOM event.
     */

  }, {
    key: "onItemsBoxBeforeKeyDown",
    value: function onItemsBoxBeforeKeyDown(event) {
      var isKeyCode = (0, _function.partial)(_unicode.isKey, event.keyCode);

      if (isKeyCode('ESCAPE')) {
        this.runLocalHooks('keydown', event, this);
      } // for keys different than below, unfocus Handsontable and focus search input


      if (!isKeyCode('ARROW_UP|ARROW_DOWN|ARROW_LEFT|ARROW_RIGHT|TAB|SPACE|ENTER')) {
        (0, _event.stopImmediatePropagation)(event);
        this.itemsBox.unlisten();
        this.itemsBox.deselectCell();
        this.searchInput.focus();
      }
    }
    /**
     * On click listener for "Select all" link.
     *
     * @private
     * @param {DOMEvent} event
     */

  }, {
    key: "onSelectAllClick",
    value: function onSelectAllClick(event) {
      event.preventDefault();
      (0, _array.arrayEach)(this.itemsBox.getSourceData(), function (row) {
        row.checked = true;
      });
      this.itemsBox.render();
    }
    /**
     * On click listener for "Clear" link.
     *
     * @private
     * @param {DOMEvent} event
     */

  }, {
    key: "onClearAllClick",
    value: function onClearAllClick(event) {
      event.preventDefault();
      (0, _array.arrayEach)(this.itemsBox.getSourceData(), function (row) {
        row.checked = false;
      });
      this.itemsBox.render();
    }
  }]);

  return MultipleSelectUI;
}(_base.default);

var _default = MultipleSelectUI;
/**
 * Pick up object items based on selected values.
 *
 * @param {Array} availableItems Base collection to compare values.
 * @param selectedValue Flat array with selected values.
 * @returns {Array}
 */

exports.default = _default;

function valueToItems(availableItems, selectedValue) {
  var arrayAssertion = (0, _utils.createArrayAssertion)(selectedValue);
  return (0, _array.arrayMap)(availableItems, function (item) {
    item.checked = arrayAssertion(item.value);
    return item;
  });
}
/**
 * Convert all checked items into flat array.
 *
 * @param {Array} availableItems Base collection.
 * @returns {Array}
 */


function itemsToValue(availableItems) {
  var items = [];
  (0, _array.arrayEach)(availableItems, function (item) {
    if (item.checked) {
      items.push(item.value);
    }
  });
  return items;
}