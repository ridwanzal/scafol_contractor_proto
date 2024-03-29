import "core-js/modules/es.symbol";
import "core-js/modules/es.symbol.description";
import "core-js/modules/es.symbol.iterator";
import "core-js/modules/es.array.concat";
import "core-js/modules/es.array.filter";
import "core-js/modules/es.array.includes";
import "core-js/modules/es.array.index-of";
import "core-js/modules/es.array.iterator";
import "core-js/modules/es.array.slice";
import "core-js/modules/es.array.splice";
import "core-js/modules/es.function.name";
import "core-js/modules/es.map";
import "core-js/modules/es.object.freeze";
import "core-js/modules/es.object.get-own-property-descriptor";
import "core-js/modules/es.object.get-prototype-of";
import "core-js/modules/es.object.set-prototype-of";
import "core-js/modules/es.object.to-string";
import "core-js/modules/es.reflect.get";
import "core-js/modules/es.string.includes";
import "core-js/modules/es.string.iterator";
import "core-js/modules/web.dom-collections.for-each";
import "core-js/modules/web.dom-collections.iterator";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _templateObject() {
  var data = _taggedTemplateLiteral(["The filter conditions have been applied properly, but couldn\u2019t be displayed visually.\n        The overall amount of conditions exceed the capability of the dropdown menu.\n        For more details see the documentation."]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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

import BasePlugin from '../_base';
import { arrayEach, arrayMap } from '../../helpers/array';
import { toSingleLine } from '../../helpers/templateLiteralTag';
import { warn } from '../../helpers/console';
import { rangeEach } from '../../helpers/number';
import EventManager from '../../eventManager';
import { addClass, removeClass, closest } from '../../helpers/dom/element';
import { registerPlugin } from '../../plugins';
import { SEPARATOR } from '../contextMenu/predefinedItems';
import * as constants from '../../i18n/constants';
import ConditionComponent from './component/condition';
import OperatorsComponent from './component/operators';
import ValueComponent from './component/value';
import ActionBarComponent from './component/actionBar';
import ConditionCollection from './conditionCollection';
import DataFilter from './dataFilter';
import ConditionUpdateObserver from './conditionUpdateObserver';
import { createArrayAssertion, toEmptyString, unifyColumnValues } from './utils';
import { CONDITION_NONE, CONDITION_BY_VALUE, OPERATION_AND, OPERATION_OR, OPERATION_OR_THEN_VARIABLE } from './constants';

/**
 * @plugin Filters
 * @dependencies DropdownMenu TrimRows HiddenRows
 *
 * @description
 * The plugin allows filtering the table data either by the built-in component or with the API.
 *
 * See [the filtering demo](https://docs.handsontable.com/pro/demo-filtering.html) for examples.
 *
 * @example
 * ```
 * const container = document.getElementById('example');
 * const hot = new Handsontable(container, {
 *   data: getData(),
 *   colHeaders: true,
 *   rowHeaders: true,
 *   dropdownMenu: true,
 *   filters: true
 * });
 * ```
 */
var Filters =
/*#__PURE__*/
function (_BasePlugin) {
  _inherits(Filters, _BasePlugin);

  function Filters(hotInstance) {
    var _this;

    _classCallCheck(this, Filters);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Filters).call(this, hotInstance));
    /**
     * Instance of {@link EventManager}.
     *
     * @private
     * @type {EventManager}
     */

    _this.eventManager = new EventManager(_assertThisInitialized(_this));
    /**
     * Instance of {@link TrimRows}.
     *
     * @private
     * @type {TrimRows}
     */

    _this.trimRowsPlugin = null;
    /**
     * Instance of {@link DropdownMenu}.
     *
     * @private
     * @type {DropdownMenu}
     */

    _this.dropdownMenuPlugin = null;
    /**
     * Instance of {@link ConditionCollection}.
     *
     * @private
     * @type {ConditionCollection}
     */

    _this.conditionCollection = null;
    /**
     * Instance of {@link ConditionUpdateObserver}.
     *
     * @private
     * @type {ConditionUpdateObserver}
     */

    _this.conditionUpdateObserver = null;
    /**
     * Map, where key is component identifier and value represent `BaseComponent` element or it derivatives.
     *
     * @private
     * @type {Map}
     */

    _this.components = new Map([['filter_by_condition', null], ['filter_operators', null], ['filter_by_condition2', null], ['filter_by_value', null], ['filter_action_bar', null]]);
    /**
     * Object containing information about last selected column physical and visual index for added filter conditions.
     *
     * @private
     * @type {Object}
     * @default null
     */

    _this.lastSelectedColumn = null;
    /**
     * Hidden menu rows indexed by physical column index
     *
     * @private
     * @type {Map}
     */

    _this.hiddenRowsCache = new Map(); // One listener for the enable/disable functionality

    _this.hot.addHook('afterGetColHeader', function (col, TH) {
      return _this.onAfterGetColHeader(col, TH);
    });

    return _this;
  }
  /**
   * Checks if the plugin is enabled in the handsontable settings. This method is executed in {@link Hooks#beforeInit}
   * hook and if it returns `true` than the {@link Filters#enablePlugin} method is called.
   *
   * @returns {Boolean}
   */


  _createClass(Filters, [{
    key: "isEnabled",
    value: function isEnabled() {
      /* eslint-disable no-unneeded-ternary */
      return this.hot.getSettings().filters ? true : false;
    }
    /**
     * Enables the plugin functionality for this Handsontable instance.
     */

  }, {
    key: "enablePlugin",
    value: function enablePlugin() {
      var _this2 = this;

      if (this.enabled) {
        return;
      }

      this.trimRowsPlugin = this.hot.getPlugin('trimRows');
      this.dropdownMenuPlugin = this.hot.getPlugin('dropdownMenu');

      var addConfirmationHooks = function addConfirmationHooks(component) {
        component.addLocalHook('accept', function () {
          return _this2.onActionBarSubmit('accept');
        });
        component.addLocalHook('cancel', function () {
          return _this2.onActionBarSubmit('cancel');
        });
        component.addLocalHook('change', function (command) {
          return _this2.onComponentChange(component, command);
        });
        return component;
      };

      var filterByConditionLabel = function filterByConditionLabel() {
        return "".concat(_this2.hot.getTranslatedPhrase(constants.FILTERS_DIVS_FILTER_BY_CONDITION), ":");
      };

      var filterValueLabel = function filterValueLabel() {
        return "".concat(_this2.hot.getTranslatedPhrase(constants.FILTERS_DIVS_FILTER_BY_VALUE), ":");
      };

      if (!this.components.get('filter_by_condition')) {
        var conditionComponent = new ConditionComponent(this.hot, {
          id: 'filter_by_condition',
          name: filterByConditionLabel,
          addSeparator: false
        });
        conditionComponent.addLocalHook('afterClose', function () {
          return _this2.onSelectUIClosed();
        });
        this.components.set('filter_by_condition', addConfirmationHooks(conditionComponent));
      }

      if (!this.components.get('filter_operators')) {
        this.components.set('filter_operators', new OperatorsComponent(this.hot, {
          id: 'filter_operators',
          name: 'Operators'
        }));
      }

      if (!this.components.get('filter_by_condition2')) {
        var _conditionComponent = new ConditionComponent(this.hot, {
          id: 'filter_by_condition2',
          name: '',
          addSeparator: true
        });

        _conditionComponent.addLocalHook('afterClose', function () {
          return _this2.onSelectUIClosed();
        });

        this.components.set('filter_by_condition2', addConfirmationHooks(_conditionComponent));
      }

      if (!this.components.get('filter_by_value')) {
        this.components.set('filter_by_value', addConfirmationHooks(new ValueComponent(this.hot, {
          id: 'filter_by_value',
          name: filterValueLabel
        })));
      }

      if (!this.components.get('filter_action_bar')) {
        this.components.set('filter_action_bar', addConfirmationHooks(new ActionBarComponent(this.hot, {
          id: 'filter_action_bar',
          name: 'Action bar'
        })));
      }

      if (!this.conditionCollection) {
        this.conditionCollection = new ConditionCollection();
      }

      if (!this.conditionUpdateObserver) {
        this.conditionUpdateObserver = new ConditionUpdateObserver(this.conditionCollection, function (column) {
          return _this2.getDataMapAtColumn(column);
        });
        this.conditionUpdateObserver.addLocalHook('update', function (conditionState) {
          return _this2.updateComponents(conditionState);
        });
      }

      this.components.forEach(function (component) {
        component.show();
      });
      this.registerEvents();
      this.addHook('beforeDropdownMenuSetItems', function (items) {
        return _this2.onBeforeDropdownMenuSetItems(items);
      });
      this.addHook('afterDropdownMenuDefaultOptions', function (defaultOptions) {
        return _this2.onAfterDropdownMenuDefaultOptions(defaultOptions);
      });
      this.addHook('afterDropdownMenuShow', function () {
        return _this2.onAfterDropdownMenuShow();
      });
      this.addHook('afterDropdownMenuHide', function () {
        return _this2.onAfterDropdownMenuHide();
      });
      this.addHook('afterChange', function (changes) {
        return _this2.onAfterChange(changes);
      }); // force to enable dependent plugins

      this.hot.getSettings().trimRows = true;
      this.trimRowsPlugin.enablePlugin(); // Temp. solution (extending menu items bug in contextMenu/dropdownMenu)

      if (this.hot.getSettings().dropdownMenu) {
        this.dropdownMenuPlugin.disablePlugin();
        this.dropdownMenuPlugin.enablePlugin();
      }

      _get(_getPrototypeOf(Filters.prototype), "enablePlugin", this).call(this);
    }
    /**
     * Registers the DOM listeners.
     *
     * @private
     */

  }, {
    key: "registerEvents",
    value: function registerEvents() {
      var _this3 = this;

      this.eventManager.addEventListener(this.hot.rootElement, 'click', function (event) {
        return _this3.onTableClick(event);
      });
    }
    /**
     * Disables the plugin functionality for this Handsontable instance.
     */

  }, {
    key: "disablePlugin",
    value: function disablePlugin() {
      if (this.enabled) {
        if (this.dropdownMenuPlugin.enabled) {
          this.dropdownMenuPlugin.menu.clearLocalHooks();
        }

        this.components.forEach(function (component) {
          component.hide();
        });
        this.conditionCollection.clean();
        this.trimRowsPlugin.untrimAll();
      }

      _get(_getPrototypeOf(Filters.prototype), "disablePlugin", this).call(this);
    }
    /**
     * @description
     * Adds condition to the conditions collection at specified column index.
     *
     * Possible predefined conditions:
     *  * `begins_with` - Begins with
     *  * `between` - Between
     *  * `by_value` - By value
     *  * `contains` - Contains
     *  * `empty` - Empty
     *  * `ends_with` - Ends with
     *  * `eq` - Equal
     *  * `gt` - Greater than
     *  * `gte` - Greater than or equal
     *  * `lt` - Less than
     *  * `lte` - Less than or equal
     *  * `none` - None (no filter)
     *  * `not_between` - Not between
     *  * `not_contains` - Not contains
     *  * `not_empty` - Not empty
     *  * `neq` - Not equal
     *
     * Possible operations on collection of conditions:
     *  * `conjunction` - [**Conjunction**](https://en.wikipedia.org/wiki/Logical_conjunction) on conditions collection (by default), i.e. for such operation: c1 AND c2 AND c3 AND c4 ... AND cn === TRUE, where c1 ... cn are conditions.
     *  * `disjunction` - [**Disjunction**](https://en.wikipedia.org/wiki/Logical_disjunction) on conditions collection, i.e. for such operation: `c1 OR c2 OR c3 OR c4 ... OR cn` === TRUE, where c1, c2, c3, c4 ... cn are conditions.
     *  * `disjunctionWithExtraCondition` - **Disjunction** on first `n - 1`\* conditions from collection with an extra requirement computed from the last condition, i.e. for such operation: `c1 OR c2 OR c3 OR c4 ... OR cn-1 AND cn` === TRUE, where c1, c2, c3, c4 ... cn are conditions.
     *
     * \* when `n` is collection size; it's used i.e. for one operation introduced from UI (when choosing from filter's drop-down menu two conditions with OR operator between them, mixed with choosing values from the multiple choice select)
     *
     * **Note**: Mind that you cannot mix different types of operations (for instance, if you use `conjunction`, use it consequently for a particular column).
     *
     * @example
     * ```js
     * const container = document.getElementById('example');
     * const hot = new Handsontable(container, {
     *   date: getData(),
     *   filters: true
     * });
     *
     * // access to filters plugin instance
     * const filtersPlugin = hot.getPlugin('filters');
     *
     * // add filter "Greater than" 95 to column at index 1
     * filtersPlugin.addCondition(1, 'gt', [95]);
     * filtersPlugin.filter();
     *
     * // add filter "By value" to column at index 1
     * // in this case all value's that don't match will be filtered.
     * filtersPlugin.addCondition(1, 'by_value', [['ing', 'ed', 'as', 'on']]);
     * filtersPlugin.filter();
     *
     * // add filter "Begins with" with value "de" AND "Not contains" with value "ing"
     * filtersPlugin.addCondition(1, 'begins_with', ['de'], 'conjunction');
     * filtersPlugin.addCondition(1, 'not_contains', ['ing'], 'conjunction');
     * filtersPlugin.filter();
     *
     * // add filter "Begins with" with value "de" OR "Not contains" with value "ing"
     * filtersPlugin.addCondition(1, 'begins_with', ['de'], 'disjunction');
     * filtersPlugin.addCondition(1, 'not_contains', ['ing'], 'disjunction');
     * filtersPlugin.filter();
     * ```
     * @param {Number} column Visual column index.
     * @param {String} name Condition short name.
     * @param {Array} args Condition arguments.
     * @param {String} operationId `id` of operation which is performed on the column
     */

  }, {
    key: "addCondition",
    value: function addCondition(column, name, args) {
      var operationId = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : OPERATION_AND;
      var physicalColumn = this.t.toPhysicalColumn(column);
      this.conditionCollection.addCondition(physicalColumn, {
        command: {
          key: name
        },
        args: args
      }, operationId);
    }
    /**
     * Removes conditions at specified column index.
     *
     * @param {Number} column Visual column index.
     */

  }, {
    key: "removeConditions",
    value: function removeConditions(column) {
      var physicalColumn = this.t.toPhysicalColumn(column);
      this.conditionCollection.removeConditions(physicalColumn);
    }
    /**
     * Clears all conditions previously added to the collection for the specified column index or, if the column index
     * was not passed, clear the conditions for all columns.
     *
     * @param {Number} [column] Visual column index.
     */

  }, {
    key: "clearConditions",
    value: function clearConditions(column) {
      if (column === void 0) {
        this.conditionCollection.clean();
      } else {
        var physicalColumn = this.t.toPhysicalColumn(column);
        this.conditionCollection.clearConditions(physicalColumn);
      }
    }
    /**
     * Filters data based on added filter conditions.
     *
     * @fires Hooks#beforeFilter
     * @fires Hooks#afterFilter
     */

  }, {
    key: "filter",
    value: function filter() {
      var dataFilter = this._createDataFilter();

      var needToFilter = !this.conditionCollection.isEmpty();
      var visibleVisualRows = [];
      var conditions = this.conditionCollection.exportAllConditions();
      var allowFiltering = this.hot.runHooks('beforeFilter', conditions);

      if (allowFiltering !== false) {
        if (needToFilter) {
          var trimmedRows = [];
          this.trimRowsPlugin.trimmedRows.length = 0;
          visibleVisualRows = arrayMap(dataFilter.filter(), function (rowData) {
            return rowData.meta.visualRow;
          });
          var visibleVisualRowsAssertion = createArrayAssertion(visibleVisualRows);
          rangeEach(this.hot.countSourceRows() - 1, function (row) {
            if (!visibleVisualRowsAssertion(row)) {
              trimmedRows.push(row);
            }
          });
          this.trimRowsPlugin.trimRows(trimmedRows);

          if (!visibleVisualRows.length) {
            this.hot.deselectCell();
          }
        } else {
          this.trimRowsPlugin.untrimAll();
        }
      }

      this.hot.view.wt.wtOverlays.adjustElementsSize(true);
      this.hot.render();
      this.clearColumnSelection();
      this.hot.runHooks('afterFilter', conditions);
    }
    /**
     * Gets last selected column index.
     *
     * @returns {Object|null} Return `null` when column isn't selected otherwise
     * object containing information about selected column with keys `visualIndex` and `physicalIndex`
     */

  }, {
    key: "getSelectedColumn",
    value: function getSelectedColumn() {
      return this.lastSelectedColumn;
    }
    /**
     * Clears column selection.
     *
     * @private
     */

  }, {
    key: "clearColumnSelection",
    value: function clearColumnSelection() {
      var _ref = this.hot.getSelectedLast() || [],
          _ref2 = _slicedToArray(_ref, 2),
          row = _ref2[0],
          col = _ref2[1];

      if (row !== void 0 && col !== void 0) {
        this.hot.selectCell(row, col);
      }
    }
    /**
     * Returns handsontable source data with cell meta based on current selection.
     *
     * @param {Number} [column] Column index. By default column index accept the value of the selected column.
     * @returns {Array} Returns array of objects where keys as row index.
     */

  }, {
    key: "getDataMapAtColumn",
    value: function getDataMapAtColumn(column) {
      var _this4 = this;

      var visualIndex = this.t.toVisualColumn(column);
      var data = [];
      arrayEach(this.hot.getSourceDataAtCol(visualIndex), function (value, rowIndex) {
        var _this4$hot$getCellMet = _this4.hot.getCellMeta(rowIndex, visualIndex),
            row = _this4$hot$getCellMet.row,
            col = _this4$hot$getCellMet.col,
            visualCol = _this4$hot$getCellMet.visualCol,
            visualRow = _this4$hot$getCellMet.visualRow,
            type = _this4$hot$getCellMet.type,
            instance = _this4$hot$getCellMet.instance,
            dateFormat = _this4$hot$getCellMet.dateFormat;

        data.push({
          meta: {
            row: row,
            col: col,
            visualCol: visualCol,
            visualRow: visualRow,
            type: type,
            instance: instance,
            dateFormat: dateFormat
          },
          value: toEmptyString(value)
        });
      });
      return data;
    }
    /**
     * `afterChange` listener.
     *
     * @private
     * @param {Array} changes Array of changes.
     */

  }, {
    key: "onAfterChange",
    value: function onAfterChange(changes) {
      var _this5 = this;

      if (changes) {
        arrayEach(changes, function (change) {
          var _change = _slicedToArray(change, 2),
              prop = _change[1];

          var columnIndex = _this5.hot.propToCol(prop);

          if (_this5.conditionCollection.hasConditions(columnIndex)) {
            _this5.updateValueComponentCondition(columnIndex);
          }
        });
      }
    }
    /**
     * Update condition of ValueComponent basing on handled changes
     *
     * @private
     * @param {Number} columnIndex Column index of handled ValueComponent condition
     */

  }, {
    key: "updateValueComponentCondition",
    value: function updateValueComponentCondition(columnIndex) {
      var dataAtCol = this.hot.getDataAtCol(columnIndex);
      var selectedValues = unifyColumnValues(dataAtCol);
      this.conditionUpdateObserver.updateStatesAtColumn(columnIndex, selectedValues);
    }
    /**
     * Restores components to their cached state.
     *
     * @private
     * @param {Array} components List of components.
     */

  }, {
    key: "restoreComponents",
    value: function restoreComponents(components) {
      var selectedColumn = this.getSelectedColumn();
      var physicalIndex = selectedColumn && selectedColumn.physicalIndex;
      components.forEach(function (component) {
        if (component.isHidden() === false) {
          component.restoreState(physicalIndex);
        }
      });
    }
    /**
     * After dropdown menu show listener.
     *
     * @private
     */

  }, {
    key: "onAfterDropdownMenuShow",
    value: function onAfterDropdownMenuShow() {
      this.restoreComponents([this.components.get('filter_by_condition'), this.components.get('filter_operators'), this.components.get('filter_by_condition2'), this.components.get('filter_by_value')]);
    }
    /**
     * After dropdown menu hide listener.
     *
     * @private
     */

  }, {
    key: "onAfterDropdownMenuHide",
    value: function onAfterDropdownMenuHide() {
      this.components.get('filter_by_condition').getSelectElement().closeOptions();
      this.components.get('filter_by_condition2').getSelectElement().closeOptions();
    }
    /**
     * Before dropdown menu set menu items listener.
     *
     * @private
     * @param {Array} items DropdownMenu items created based on predefined items and settings provided by user.
     */

  }, {
    key: "onBeforeDropdownMenuSetItems",
    value: function onBeforeDropdownMenuSetItems(items) {
      var menuKeys = arrayMap(items, function (item) {
        return item.key;
      });
      this.components.forEach(function (component) {
        component[menuKeys.indexOf(component.getMenuItemDescriptor().key) === -1 ? 'hide' : 'show']();
      });
      this.initHiddenRowsCache();
    }
    /**
     * After dropdown menu default options listener.
     *
     * @private
     * @param {Object} defaultOptions ContextMenu default item options.
     */

  }, {
    key: "onAfterDropdownMenuDefaultOptions",
    value: function onAfterDropdownMenuDefaultOptions(defaultOptions) {
      defaultOptions.items.push({
        name: SEPARATOR
      });
      this.components.forEach(function (component) {
        defaultOptions.items.push(component.getMenuItemDescriptor());
      });
    }
    /**
     * Get operation basing on number and type of arguments (where arguments are states of components)
     *
     * @param {String} suggestedOperation operation which was chosen by user from UI
     * @param {Object} byConditionState1 state of first condition component
     * @param {Object} byConditionState2 state of second condition component
     * @param {Object} byValueState state of value component
     * @private
     * @returns {String}
     */

  }, {
    key: "getOperationBasedOnArguments",
    value: function getOperationBasedOnArguments(suggestedOperation, byConditionState1, byConditionState2, byValueState) {
      var operation = suggestedOperation;

      if (operation === OPERATION_OR && byConditionState1.command.key !== CONDITION_NONE && byConditionState2.command.key !== CONDITION_NONE && byValueState.command.key !== CONDITION_NONE) {
        operation = OPERATION_OR_THEN_VARIABLE;
      } else if (byValueState.command.key !== CONDITION_NONE) {
        if (byConditionState1.command.key === CONDITION_NONE || byConditionState2.command.key === CONDITION_NONE) {
          operation = OPERATION_AND;
        }
      }

      return operation;
    }
    /**
     * On action bar submit listener.
     *
     * @private
     * @param {String} submitType
     */

  }, {
    key: "onActionBarSubmit",
    value: function onActionBarSubmit(submitType) {
      if (submitType === 'accept') {
        var selectedColumn = this.getSelectedColumn();
        var physicalIndex = selectedColumn && selectedColumn.physicalIndex;
        var byConditionState1 = this.components.get('filter_by_condition').getState();
        var byConditionState2 = this.components.get('filter_by_condition2').getState();
        var byValueState = this.components.get('filter_by_value').getState();
        var operation = this.getOperationBasedOnArguments(this.components.get('filter_operators').getActiveOperationId(), byConditionState1, byConditionState2, byValueState);
        this.conditionUpdateObserver.groupChanges();
        this.conditionCollection.clearConditions(physicalIndex);

        if (byConditionState1.command.key === CONDITION_NONE && byConditionState2.command.key === CONDITION_NONE && byValueState.command.key === CONDITION_NONE) {
          this.conditionCollection.removeConditions(physicalIndex);
        } else {
          if (byConditionState1.command.key !== CONDITION_NONE) {
            this.conditionCollection.addCondition(physicalIndex, byConditionState1, operation);

            if (byConditionState2.command.key !== CONDITION_NONE) {
              this.conditionCollection.addCondition(physicalIndex, byConditionState2, operation);
            }
          }

          if (byValueState.command.key !== CONDITION_NONE) {
            this.conditionCollection.addCondition(physicalIndex, byValueState, operation);
          }
        }

        this.conditionUpdateObserver.flush();
        this.components.get('filter_operators').saveState(physicalIndex);
        this.components.get('filter_by_value').saveState(physicalIndex);
        this.saveHiddenRowsCache(physicalIndex);
        this.trimRowsPlugin.trimmedRows.length = 0;
        this.filter();
      }

      this.dropdownMenuPlugin.close();
    }
    /**
     * On component change listener.
     *
     * @private
     * @param {BaseComponent} component Component inheriting BaseComponent
     * @param {Object} command Menu item object (command).
     */

  }, {
    key: "onComponentChange",
    value: function onComponentChange(component, command) {
      if (component === this.components.get('filter_by_condition')) {
        if (command.showOperators) {
          this.showComponents(this.components.get('filter_by_condition2'), this.components.get('filter_operators'));
        } else {
          this.hideComponents(this.components.get('filter_by_condition2'), this.components.get('filter_operators'));
        }
      }

      if (component.constructor === ConditionComponent && !command.inputsCount) {
        this.setListeningDropdownMenu();
      }
    }
    /**
     * On component SelectUI closed listener.
     *
     * @private
     */

  }, {
    key: "onSelectUIClosed",
    value: function onSelectUIClosed() {
      this.setListeningDropdownMenu();
    }
    /**
     * Listen to the keyboard input on document body and forward events to instance of Handsontable
     * created by DropdownMenu plugin
     *
     * @private
     */

  }, {
    key: "setListeningDropdownMenu",
    value: function setListeningDropdownMenu() {
      this.dropdownMenuPlugin.setListening();
    }
    /**
     * On after get column header listener.
     *
     * @private
     * @param {Number} col
     * @param {HTMLTableCellElement} TH
     */

  }, {
    key: "onAfterGetColHeader",
    value: function onAfterGetColHeader(col, TH) {
      var physicalColumn = this.t.toPhysicalColumn(col);

      if (this.enabled && this.conditionCollection.hasConditions(physicalColumn)) {
        addClass(TH, 'htFiltersActive');
      } else {
        removeClass(TH, 'htFiltersActive');
      }
    }
    /**
     * On table click listener.
     *
     * @private
     * @param {Event} event DOM Event.
     */

  }, {
    key: "onTableClick",
    value: function onTableClick(event) {
      var th = closest(event.target, 'TH');

      if (th) {
        var visualIndex = this.hot.getCoords(th).col;
        var physicalIndex = this.t.toPhysicalColumn(visualIndex);
        this.lastSelectedColumn = {
          visualIndex: visualIndex,
          physicalIndex: physicalIndex
        };
      }
    }
    /**
     * Destroys the plugin instance.
     */

  }, {
    key: "destroy",
    value: function destroy() {
      if (this.enabled) {
        this.components.forEach(function (component) {
          component.destroy();
        });
        this.conditionCollection.destroy();
        this.conditionUpdateObserver.destroy();
        this.hiddenRowsCache.clear();
        this.trimRowsPlugin.disablePlugin();
      }

      _get(_getPrototypeOf(Filters.prototype), "destroy", this).call(this);
    }
    /**
     * Creates DataFilter instance based on condition collection.
     *
     * @private
     * @param {ConditionCollection} conditionCollection Condition collection object.
     * @returns {DataFilter}
     */

  }, {
    key: "_createDataFilter",
    value: function _createDataFilter() {
      var _this6 = this;

      var conditionCollection = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.conditionCollection;
      return new DataFilter(conditionCollection, function (column) {
        return _this6.getDataMapAtColumn(column);
      });
    }
    /**
     * Updates components basing on conditions state.
     *
     * @private
     * @param {Object} conditionsState
     */

  }, {
    key: "updateComponents",
    value: function updateComponents(conditionsState) {
      if (!this.dropdownMenuPlugin.enabled) {
        return;
      }

      var conditions = conditionsState.editedConditionStack.conditions;
      var column = conditionsState.editedConditionStack.column;
      var conditionsByValue = conditions.filter(function (condition) {
        return condition.name === CONDITION_BY_VALUE;
      });
      var conditionsWithoutByValue = conditions.filter(function (condition) {
        return condition.name !== CONDITION_BY_VALUE;
      });
      var operationType = this.conditionCollection.columnTypes[column];

      if (conditionsByValue.length === 2 || conditionsWithoutByValue.length === 3) {
        warn(toSingleLine(_templateObject()));
      } else {
        if (conditionsWithoutByValue.length > 0) {
          this.showComponentForParticularColumn(this.components.get('filter_operators'), column);
        }

        this.components.get('filter_by_condition').updateState(conditionsWithoutByValue[0], column);
        this.components.get('filter_by_condition2').updateState(conditionsWithoutByValue[1], column);
        this.components.get('filter_by_value').updateState(conditionsState);
        this.components.get('filter_operators').updateState(operationType, column);
      }
    }
    /**
     * Shows component for particular column.
     *
     * @private
     * @param {BaseComponent} component `BaseComponent` element or it derivatives.
     * @param {Number} column Physical column index.
     */

  }, {
    key: "showComponentForParticularColumn",
    value: function showComponentForParticularColumn(component, column) {
      if (!this.hiddenRowsCache.has(column)) {
        this.hiddenRowsCache.set(column, []);
      } else {
        var indexes = this.getIndexesOfComponents(component);
        this.removeIndexesFromHiddenRowsCache(column, indexes);
      }
    }
    /**
     * Removes specific rows from `hiddenRows` cache for particular column.
     *
     * @private
     * @param {Number} column Physical column index.
     * @param {Array} indexes Physical indexes of rows which will be removed from `hiddenRows` cache
     */

  }, {
    key: "removeIndexesFromHiddenRowsCache",
    value: function removeIndexesFromHiddenRowsCache(column, indexes) {
      var hiddenRowsForColumn = this.hiddenRowsCache.get(column);
      arrayEach(indexes, function (index) {
        if (hiddenRowsForColumn.includes(index)) {
          hiddenRowsForColumn.splice(hiddenRowsForColumn.indexOf(index), 1);
        }
      });
    }
    /**
     * Returns indexes of passed components inside list of `dropdownMenu` items.
     *
     * @private
     * @param {...BaseComponent} components List of components.
     * @returns {Array}
     */

  }, {
    key: "getIndexesOfComponents",
    value: function getIndexesOfComponents() {
      var menu = this.dropdownMenuPlugin.menu;
      var indexes = [];

      for (var _len = arguments.length, components = new Array(_len), _key = 0; _key < _len; _key++) {
        components[_key] = arguments[_key];
      }

      arrayEach(components, function (component) {
        arrayEach(menu.menuItems, function (item, index) {
          if (item.key === component.getMenuItemDescriptor().key) {
            indexes.push(index);
          }
        });
      });
      return indexes;
    }
    /**
     * Changes visibility of component.
     *
     * @private
     * @param {Boolean} visible Determine if components should be visible.
     * @param {...BaseComponent} components List of components.
     */

  }, {
    key: "changeComponentsVisibility",
    value: function changeComponentsVisibility() {
      var visible = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var menu = this.dropdownMenuPlugin.menu;
      var hotMenu = menu.hotMenu;
      var hiddenRows = hotMenu.getPlugin('hiddenRows');

      for (var _len2 = arguments.length, components = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        components[_key2 - 1] = arguments[_key2];
      }

      var indexes = this.getIndexesOfComponents.apply(this, components);

      if (visible) {
        hiddenRows.showRows(indexes);
      } else {
        hiddenRows.hideRows(indexes);
      }

      hotMenu.render();
    }
    /**
     * Initializes `hiddenRows` cache.
     *
     * @private
     */

  }, {
    key: "initHiddenRowsCache",
    value: function initHiddenRowsCache() {
      var _this7 = this;

      this.dropdownMenuPlugin.menu.addLocalHook('afterOpen', function () {
        var index = _this7.lastSelectedColumn.physicalIndex;

        if (!_this7.hiddenRowsCache.has(index)) {
          _this7.hiddenRowsCache.set(index, _this7.getIndexesOfComponents(_this7.components.get('filter_operators'), _this7.components.get('filter_by_condition2')));
        }

        _this7.dropdownMenuPlugin.menu.hotMenu.updateSettings({
          hiddenRows: {
            rows: _this7.hiddenRowsCache.get(index)
          }
        });
      });
    }
    /**
     * Saves `hiddenRows` cache for particular row.
     *
     * @private
     * @param rowIndex Physical row index
     */

  }, {
    key: "saveHiddenRowsCache",
    value: function saveHiddenRowsCache(rowIndex) {
      this.hiddenRowsCache.set(rowIndex, this.dropdownMenuPlugin.menu.hotMenu.getPlugin('hiddenRows').hiddenRows);
    }
    /**
     * Hides components of filters `dropdownMenu`.
     *
     * @private
     * @param {...BaseComponent} components List of components.
     */

  }, {
    key: "hideComponents",
    value: function hideComponents() {
      for (var _len3 = arguments.length, components = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        components[_key3] = arguments[_key3];
      }

      this.changeComponentsVisibility.apply(this, [false].concat(components));
    }
    /**
     * Shows components of filters `dropdownMenu`.
     *
     * @private
     * @param {...BaseComponent} components List of components.
     */

  }, {
    key: "showComponents",
    value: function showComponents() {
      for (var _len4 = arguments.length, components = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        components[_key4] = arguments[_key4];
      }

      this.changeComponentsVisibility.apply(this, [true].concat(components));
    }
  }]);

  return Filters;
}(BasePlugin);

registerPlugin('filters', Filters);
export default Filters;