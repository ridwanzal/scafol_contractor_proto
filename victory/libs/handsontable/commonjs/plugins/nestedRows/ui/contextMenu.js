"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.symbol.iterator");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.array.splice");

require("core-js/modules/es.object.get-own-property-descriptor");

require("core-js/modules/es.object.get-prototype-of");

require("core-js/modules/es.object.set-prototype-of");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.string.iterator");

require("core-js/modules/es.weak-map");

require("core-js/modules/web.dom-collections.iterator");

exports.__esModule = true;
exports.default = void 0;

var _number = require("../../../helpers/number");

var _array = require("../../../helpers/array");

var C = _interopRequireWildcard(require("../../../i18n/constants"));

var _base = _interopRequireDefault(require("./_base"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var privatePool = new WeakMap();
/**
 * Class responsible for the Context Menu entries for the Nested Rows plugin.
 *
 * @class ContextMenuUI
 * @util
 * @extends BaseUI
 */

var ContextMenuUI =
/*#__PURE__*/
function (_BaseUI) {
  _inherits(ContextMenuUI, _BaseUI);

  function ContextMenuUI(nestedRowsPlugin, hotInstance) {
    var _this;

    _classCallCheck(this, ContextMenuUI);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ContextMenuUI).call(this, nestedRowsPlugin, hotInstance));
    privatePool.set(_assertThisInitialized(_this), {
      row_above: function row_above(key, selection) {
        _this.dataManager.addSibling(selection.start.row, 'above');
      },
      row_below: function row_below(key, selection) {
        _this.dataManager.addSibling(selection.start.row, 'below');
      }
    });
    /**
     * Reference to the DataManager instance connected with the Nested Rows plugin.
     *
     * @type {DataManager}
     */

    _this.dataManager = _this.plugin.dataManager;
    return _this;
  }
  /**
   * Append options to the context menu. (Propagated from the `afterContextMenuDefaultOptions` hook callback)
   * f
   * @private
   * @param {Object} defaultOptions Default context menu options.
   * @returns {*}
   */


  _createClass(ContextMenuUI, [{
    key: "appendOptions",
    value: function appendOptions(defaultOptions) {
      var _this2 = this;

      var newEntries = [{
        key: 'add_child',
        name: function name() {
          return this.getTranslatedPhrase(C.CONTEXTMENU_ITEMS_NESTED_ROWS_INSERT_CHILD);
        },
        callback: function callback() {
          var translatedRowIndex = _this2.dataManager.translateTrimmedRow(_this2.hot.getSelectedLast()[0]);

          var parent = _this2.dataManager.getDataObject(translatedRowIndex);

          _this2.dataManager.addChild(parent);
        },
        disabled: function disabled() {
          var selected = _this2.hot.getSelectedLast();

          return !selected || selected[0] < 0 || _this2.hot.selection.isSelectedByColumnHeader() || _this2.hot.countRows() >= _this2.hot.getSettings().maxRows;
        }
      }, {
        key: 'detach_from_parent',
        name: function name() {
          return this.getTranslatedPhrase(C.CONTEXTMENU_ITEMS_NESTED_ROWS_DETACH_CHILD);
        },
        callback: function callback() {
          _this2.dataManager.detachFromParent(_this2.hot.getSelectedLast());
        },
        disabled: function disabled() {
          var selected = _this2.hot.getSelectedLast();

          var translatedRowIndex = _this2.dataManager.translateTrimmedRow(selected[0]);

          var parent = _this2.dataManager.getRowParent(translatedRowIndex);

          return !parent || !selected || selected[0] < 0 || _this2.hot.selection.isSelectedByColumnHeader() || _this2.hot.countRows() >= _this2.hot.getSettings().maxRows;
        }
      }, {
        name: '---------'
      }];
      (0, _number.rangeEach)(0, defaultOptions.items.length - 1, function (i) {
        if (i === 0) {
          (0, _array.arrayEach)(newEntries, function (val, j) {
            defaultOptions.items.splice(i + j, 0, val);
          });
          return false;
        }
      });
      return this.modifyRowInsertingOptions(defaultOptions);
    }
    /**
     * Modify how the row inserting options work.
     *
     * @private
     * @param {Object} defaultOptions Default context menu items.
     * @returns {*}
     */

  }, {
    key: "modifyRowInsertingOptions",
    value: function modifyRowInsertingOptions(defaultOptions) {
      var priv = privatePool.get(this);
      (0, _number.rangeEach)(0, defaultOptions.items.length - 1, function (i) {
        var option = priv[defaultOptions.items[i].key];

        if (option !== null && option !== void 0) {
          defaultOptions.items[i].callback = option;
        }
      });
      return defaultOptions;
    }
  }]);

  return ContextMenuUI;
}(_base.default);

var _default = ContextMenuUI;
exports.default = _default;