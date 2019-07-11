import "core-js/modules/es.symbol";
import "core-js/modules/es.symbol.description";
import "core-js/modules/es.symbol.iterator";
import "core-js/modules/es.array.concat";
import "core-js/modules/es.array.iterator";
import "core-js/modules/es.object.get-own-property-descriptor";
import "core-js/modules/es.object.get-prototype-of";
import "core-js/modules/es.object.set-prototype-of";
import "core-js/modules/es.object.to-string";
import "core-js/modules/es.reflect.get";
import "core-js/modules/es.string.iterator";
import "core-js/modules/web.dom-collections.iterator";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

import BasePlugin from './../_base';
import Hooks from './../../pluginHooks';
import { arrayEach } from './../../helpers/array';
import CommandExecutor from './commandExecutor';
import EventManager from './../../eventManager';
import ItemsFactory from './itemsFactory';
import Menu from './menu';
import { registerPlugin } from './../../plugins';
import { stopPropagation, pageX, pageY } from './../../helpers/dom/event';
import { getWindowScrollLeft, getWindowScrollTop, hasClass } from './../../helpers/dom/element';
import { ROW_ABOVE, ROW_BELOW, COLUMN_LEFT, COLUMN_RIGHT, REMOVE_ROW, REMOVE_COLUMN, UNDO, REDO, READ_ONLY, ALIGNMENT, SEPARATOR } from './predefinedItems';
Hooks.getSingleton().register('afterContextMenuDefaultOptions');
Hooks.getSingleton().register('beforeContextMenuShow');
Hooks.getSingleton().register('afterContextMenuShow');
Hooks.getSingleton().register('afterContextMenuHide');
Hooks.getSingleton().register('afterContextMenuExecute');
/**
 * @description
 * This plugin creates the Handsontable Context Menu. It allows to create a new row or column at any place in the
 * grid among [other features](https://handsontable.com/docs/demo-context-menu.html).
 * Possible values:
 * * `true` (to enable default options),
 * * `false` (to disable completely)
 *
 * or array of any available strings:
 * * `'row_above'`
 * * `'row_below'`
 * * `'col_left'`
 * * `'col_right'`
 * * `'remove_row'`
 * * `'remove_col'`
 * * `'undo'`
 * * `'redo'`
 * * `'make_read_only'`
 * * `'alignment'`
 * * `'---------'` (menu item separator)
 * * `'borders'` (with {@link Options#customBorders} turned on)
 * * `'commentsAddEdit'` (with {@link Options#comments} turned on)
 * * `'commentsRemove'` (with {@link Options#comments} turned on)
 *
 * See [the context menu demo](https://handsontable.com/docs/demo-context-menu.html) for examples.
 *
 * @example
 * ```js
 * // as a boolean
 * contextMenu: true
 * // as a array
 * contextMenu: ['row_above', 'row_below', '---------', 'undo', 'redo']
 * ```
 *
 * @plugin ContextMenu
 */

var ContextMenu =
/*#__PURE__*/
function (_BasePlugin) {
  _inherits(ContextMenu, _BasePlugin);

  _createClass(ContextMenu, null, [{
    key: "DEFAULT_ITEMS",

    /**
     * Context menu default items order when `contextMenu` options is set as `true`.
     *
     * @returns {String[]}
     */
    get: function get() {
      return [ROW_ABOVE, ROW_BELOW, SEPARATOR, COLUMN_LEFT, COLUMN_RIGHT, SEPARATOR, REMOVE_ROW, REMOVE_COLUMN, SEPARATOR, UNDO, REDO, SEPARATOR, READ_ONLY, SEPARATOR, ALIGNMENT];
    }
  }]);

  function ContextMenu(hotInstance) {
    var _this;

    _classCallCheck(this, ContextMenu);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ContextMenu).call(this, hotInstance));
    /**
     * Instance of {@link EventManager}.
     *
     * @private
     * @type {EventManager}
     */

    _this.eventManager = new EventManager(_assertThisInitialized(_this));
    /**
     * Instance of {@link CommandExecutor}.
     *
     * @private
     * @type {CommandExecutor}
     */

    _this.commandExecutor = new CommandExecutor(_this.hot);
    /**
     * Instance of {@link ItemsFactory}.
     *
     * @private
     * @type {ItemsFactory}
     */

    _this.itemsFactory = null;
    /**
     * Instance of {@link Menu}.
     *
     * @private
     * @type {Menu}
     */

    _this.menu = null;
    return _this;
  }
  /**
   * Checks if the plugin is enabled in the handsontable settings. This method is executed in {@link Hooks#beforeInit}
   * hook and if it returns `true` than the {@link ContextMenu#enablePlugin} method is called.
   *
   * @returns {Boolean}
   */


  _createClass(ContextMenu, [{
    key: "isEnabled",
    value: function isEnabled() {
      return this.hot.getSettings().contextMenu;
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

      var settings = this.hot.getSettings().contextMenu;

      if (typeof settings.callback === 'function') {
        this.commandExecutor.setCommonCallback(settings.callback);
      }

      this.menu = new Menu(this.hot, {
        className: 'htContextMenu',
        keepInViewport: true
      });
      this.menu.addLocalHook('beforeOpen', function () {
        return _this2.onMenuBeforeOpen();
      });
      this.menu.addLocalHook('afterOpen', function () {
        return _this2.onMenuAfterOpen();
      });
      this.menu.addLocalHook('afterClose', function () {
        return _this2.onMenuAfterClose();
      });
      this.menu.addLocalHook('executeCommand', function () {
        var _this2$executeCommand;

        for (var _len = arguments.length, params = new Array(_len), _key = 0; _key < _len; _key++) {
          params[_key] = arguments[_key];
        }

        return (_this2$executeCommand = _this2.executeCommand).call.apply(_this2$executeCommand, [_this2].concat(params));
      });
      this.addHook('afterOnCellContextMenu', function (event) {
        return _this2.onAfterOnCellContextMenu(event);
      });

      _get(_getPrototypeOf(ContextMenu.prototype), "enablePlugin", this).call(this);
    }
    /**
     * Updates the plugin state. This method is executed when {@link Core#updateSettings} is invoked.
     */

  }, {
    key: "updatePlugin",
    value: function updatePlugin() {
      this.disablePlugin();
      this.enablePlugin();

      _get(_getPrototypeOf(ContextMenu.prototype), "updatePlugin", this).call(this);
    }
    /**
     * Disables the plugin functionality for this Handsontable instance.
     */

  }, {
    key: "disablePlugin",
    value: function disablePlugin() {
      this.close();

      if (this.menu) {
        this.menu.destroy();
        this.menu = null;
      }

      _get(_getPrototypeOf(ContextMenu.prototype), "disablePlugin", this).call(this);
    }
    /**
     * Opens menu and re-position it based on the passed coordinates.
     *
     * @param {Object|Event} position An object with `pageX` and `pageY` properties which contains values relative to
     *                                the top left of the fully rendered content area in the browser or with `clientX`
     *                                and `clientY`  properties which contains values relative to the upper left edge
     *                                of the content area (the viewport) of the browser window. This object is structurally
     *                                compatible with native mouse event so it can be used either.
     */

  }, {
    key: "open",
    value: function open(event) {
      if (!this.menu) {
        return;
      }

      this.prepareMenuItems();
      this.menu.open();

      if (!this.menu.isOpened()) {
        return;
      }

      this.menu.setPosition({
        top: parseInt(pageY(event), 10) - getWindowScrollTop(this.hot.rootWindow),
        left: parseInt(pageX(event), 10) - getWindowScrollLeft(this.hot.rootWindow)
      }); // ContextMenu is not detected HotTableEnv correctly because is injected outside hot-table

      this.menu.hotMenu.isHotTableEnv = this.hot.isHotTableEnv; // Handsontable.eventManager.isHotTableEnv = this.hot.isHotTableEnv;
    }
    /**
     * Closes the menu.
     */

  }, {
    key: "close",
    value: function close() {
      if (!this.menu) {
        return;
      }

      this.menu.close();
      this.itemsFactory = null;
    }
    /**
     * Execute context menu command.
     *
     * You can execute all predefined commands:
     *  * `'row_above'` - Insert row above
     *  * `'row_below'` - Insert row below
     *  * `'col_left'` - Insert column left
     *  * `'col_right'` - Insert column right
     *  * `'clear_column'` - Clear selected column
     *  * `'remove_row'` - Remove row
     *  * `'remove_col'` - Remove column
     *  * `'undo'` - Undo last action
     *  * `'redo'` - Redo last action
     *  * `'make_read_only'` - Make cell read only
     *  * `'alignment:left'` - Alignment to the left
     *  * `'alignment:top'` - Alignment to the top
     *  * `'alignment:right'` - Alignment to the right
     *  * `'alignment:bottom'` - Alignment to the bottom
     *  * `'alignment:middle'` - Alignment to the middle
     *  * `'alignment:center'` - Alignment to the center (justify)
     *
     * Or you can execute command registered in settings where `key` is your command name.
     *
     * @param {String} commandName The command name to be executed.
     * @param {...*} params
     */

  }, {
    key: "executeCommand",
    value: function executeCommand(commandName) {
      var _this$commandExecutor;

      if (this.itemsFactory === null) {
        this.prepareMenuItems();
      }

      for (var _len2 = arguments.length, params = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        params[_key2 - 1] = arguments[_key2];
      }

      (_this$commandExecutor = this.commandExecutor).execute.apply(_this$commandExecutor, [commandName].concat(params));
    }
    /**
     * Prepares available contextMenu's items list and registers them in commandExecutor.
     *
     * @private
     * @fires Hooks#afterContextMenuDefaultOptions
     * @fires Hooks#beforeContextMenuSetItems
     */

  }, {
    key: "prepareMenuItems",
    value: function prepareMenuItems() {
      var _this3 = this;

      this.itemsFactory = new ItemsFactory(this.hot, ContextMenu.DEFAULT_ITEMS);
      var settings = this.hot.getSettings().contextMenu;
      var predefinedItems = {
        items: this.itemsFactory.getItems(settings)
      };
      this.hot.runHooks('afterContextMenuDefaultOptions', predefinedItems);
      this.itemsFactory.setPredefinedItems(predefinedItems.items);
      var menuItems = this.itemsFactory.getItems(settings);
      this.hot.runHooks('beforeContextMenuSetItems', menuItems);
      this.menu.setMenuItems(menuItems); // Register all commands. Predefined and added by user or by plugins

      arrayEach(menuItems, function (command) {
        return _this3.commandExecutor.registerCommand(command.key, command);
      });
    }
    /**
     * On contextmenu listener.
     *
     * @private
     * @param {Event} event
     */

  }, {
    key: "onAfterOnCellContextMenu",
    value: function onAfterOnCellContextMenu(event) {
      var settings = this.hot.getSettings();
      var showRowHeaders = settings.rowHeaders;
      var showColHeaders = settings.colHeaders;

      function isValidElement(element) {
        return element.nodeName === 'TD' || element.parentNode.nodeName === 'TD';
      } // if event is from hot-table we must get web component element not element inside him


      var element = event.realTarget;
      this.close();

      if (hasClass(element, 'handsontableInput')) {
        return;
      }

      event.preventDefault();
      stopPropagation(event);

      if (!(showRowHeaders || showColHeaders)) {
        if (!isValidElement(element) && !(hasClass(element, 'current') && hasClass(element, 'wtBorder'))) {
          return;
        }
      }

      this.open(event);
    }
    /**
     * On menu before open listener.
     *
     * @private
     */

  }, {
    key: "onMenuBeforeOpen",
    value: function onMenuBeforeOpen() {
      this.hot.runHooks('beforeContextMenuShow', this);
    }
    /**
     * On menu after open listener.
     *
     * @private
     */

  }, {
    key: "onMenuAfterOpen",
    value: function onMenuAfterOpen() {
      this.hot.runHooks('afterContextMenuShow', this);
    }
    /**
     * On menu after close listener.
     *
     * @private
     */

  }, {
    key: "onMenuAfterClose",
    value: function onMenuAfterClose() {
      this.hot.listen();
      this.hot.runHooks('afterContextMenuHide', this);
    }
    /**
     * Destroys the plugin instance.
     */

  }, {
    key: "destroy",
    value: function destroy() {
      this.close();

      if (this.menu) {
        this.menu.destroy();
      }

      _get(_getPrototypeOf(ContextMenu.prototype), "destroy", this).call(this);
    }
  }]);

  return ContextMenu;
}(BasePlugin);

ContextMenu.SEPARATOR = {
  name: SEPARATOR
};
registerPlugin('contextMenu', ContextMenu);
export default ContextMenu;