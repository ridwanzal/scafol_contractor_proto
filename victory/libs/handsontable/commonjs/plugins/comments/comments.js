"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.symbol.iterator");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.object.get-own-property-descriptor");

require("core-js/modules/es.object.get-prototype-of");

require("core-js/modules/es.object.set-prototype-of");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.reflect.get");

require("core-js/modules/es.string.iterator");

require("core-js/modules/es.weak-map");

require("core-js/modules/web.dom-collections.iterator");

require("core-js/modules/web.timers");

exports.__esModule = true;
exports.default = void 0;

var _element = require("./../../helpers/dom/element");

var _object = require("./../../helpers/object");

var _eventManager = _interopRequireDefault(require("./../../eventManager"));

var _src = require("./../../3rdparty/walkontable/src");

var _plugins = require("./../../plugins");

var _base = _interopRequireDefault(require("./../_base"));

var _commentEditor = _interopRequireDefault(require("./commentEditor"));

var _utils = require("./../contextMenu/utils");

var _displaySwitch = _interopRequireDefault(require("./displaySwitch"));

var C = _interopRequireWildcard(require("./../../i18n/constants"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

var privatePool = new WeakMap();
var META_COMMENT = 'comment';
var META_COMMENT_VALUE = 'value';
var META_STYLE = 'style';
var META_READONLY = 'readOnly';
/**
 * @plugin Comments
 *
 * @description
 * This plugin allows setting and managing cell comments by either an option in the context menu or with the use of
 * the API.
 *
 * To enable the plugin, you'll need to set the comments property of the config object to `true`:
 * ```js
 * comments: true
 * ```
 *
 * or an object with extra predefined plugin config:
 *
 * ```js
 * comments: {
 *   displayDelay: 1000
 * }
 * ```
 *
 * To add comments at the table initialization, define the `comment` property in the `cell` config array as in an example below.
 *
 * @example
 *
 * ```js
 * const hot = new Handsontable(document.getElementById('example'), {
 *   date: getData(),
 *   comments: true,
 *   cell: [
 *     {row: 1, col: 1, comment: {value: 'Foo'}},
 *     {row: 2, col: 2, comment: {value: 'Bar'}}
 *   ]
 * });
 *
 * // Access to the Comments plugin instance:
 * const commentsPlugin = hot.getPlugin('comments');
 *
 * // Manage comments programmatically:
 * commentsPlugin.setCommentAtCell(1, 6, 'Comment contents');
 * commentsPlugin.showAtCell(1, 6);
 * commentsPlugin.removeCommentAtCell(1, 6);
 *
 * // You can also set range once and use proper methods:
 * commentsPlugin.setRange({from: {row: 1, col: 6}});
 * commentsPlugin.setComment('Comment contents');
 * commentsPlugin.show();
 * commentsPlugin.removeComment();
 * ```
 */

var Comments =
/*#__PURE__*/
function (_BasePlugin) {
  _inherits(Comments, _BasePlugin);

  function Comments(hotInstance) {
    var _this;

    _classCallCheck(this, Comments);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Comments).call(this, hotInstance));
    /**
     * Instance of {@link CommentEditor}.
     *
     * @private
     * @type {CommentEditor}
     */

    _this.editor = null;
    /**
     * Instance of {@link DisplaySwitch}.
     *
     * @private
     * @type {DisplaySwitch}
     */

    _this.displaySwitch = null;
    /**
     * Instance of {@link EventManager}.
     *
     * @private
     * @type {EventManager}
     */

    _this.eventManager = null;
    /**
     * Current cell range, an object with `from` property, with `row` and `col` properties (e.q. `{from: {row: 1, col: 6}}`).
     *
     * @type {Object}
     */

    _this.range = {};
    /**
     * @private
     * @type {Boolean}
     */

    _this.mouseDown = false;
    /**
     * @private
     * @type {Boolean}
     */

    _this.contextMenuEvent = false;
    /**
     * @private
     * @type {*}
     */

    _this.timer = null;
    privatePool.set(_assertThisInitialized(_this), {
      tempEditorDimensions: {},
      cellBelowCursor: null
    });
    return _this;
  }
  /**
   * Checks if the plugin is enabled in the handsontable settings. This method is executed in {@link Hooks#beforeInit}
   * hook and if it returns `true` than the {@link Comments#enablePlugin} method is called.
   *
   * @returns {Boolean}
   */


  _createClass(Comments, [{
    key: "isEnabled",
    value: function isEnabled() {
      return !!this.hot.getSettings().comments;
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

      if (!this.editor) {
        this.editor = new _commentEditor.default(this.hot.rootDocument);
      }

      if (!this.eventManager) {
        this.eventManager = new _eventManager.default(this);
      }

      if (!this.displaySwitch) {
        this.displaySwitch = new _displaySwitch.default(this.getDisplayDelaySetting());
      }

      this.addHook('afterContextMenuDefaultOptions', function (options) {
        return _this2.addToContextMenu(options);
      });
      this.addHook('afterRenderer', function (TD, row, col, prop, value, cellProperties) {
        return _this2.onAfterRenderer(TD, cellProperties);
      });
      this.addHook('afterScrollHorizontally', function () {
        return _this2.hide();
      });
      this.addHook('afterScrollVertically', function () {
        return _this2.hide();
      });
      this.addHook('afterBeginEditing', function () {
        return _this2.onAfterBeginEditing();
      });
      this.displaySwitch.addLocalHook('hide', function () {
        return _this2.hide();
      });
      this.displaySwitch.addLocalHook('show', function (row, col) {
        return _this2.showAtCell(row, col);
      });
      this.registerListeners();

      _get(_getPrototypeOf(Comments.prototype), "enablePlugin", this).call(this);
    }
    /**
     * Updates the plugin state. This method is executed when {@link Core#updateSettings} is invoked.
     */

  }, {
    key: "updatePlugin",
    value: function updatePlugin() {
      this.disablePlugin();
      this.enablePlugin();

      _get(_getPrototypeOf(Comments.prototype), "updatePlugin", this).call(this);

      this.displaySwitch.updateDelay(this.getDisplayDelaySetting());
    }
    /**
     * Disables the plugin functionality for this Handsontable instance.
     */

  }, {
    key: "disablePlugin",
    value: function disablePlugin() {
      _get(_getPrototypeOf(Comments.prototype), "disablePlugin", this).call(this);
    }
    /**
     * Registers all necessary DOM listeners.
     *
     * @private
     */

  }, {
    key: "registerListeners",
    value: function registerListeners() {
      var _this3 = this;

      var rootDocument = this.hot.rootDocument;
      this.eventManager.addEventListener(rootDocument, 'mouseover', function (event) {
        return _this3.onMouseOver(event);
      });
      this.eventManager.addEventListener(rootDocument, 'mousedown', function (event) {
        return _this3.onMouseDown(event);
      });
      this.eventManager.addEventListener(rootDocument, 'mouseup', function () {
        return _this3.onMouseUp();
      });
      this.eventManager.addEventListener(this.editor.getInputElement(), 'blur', function () {
        return _this3.onEditorBlur();
      });
      this.eventManager.addEventListener(this.editor.getInputElement(), 'mousedown', function (event) {
        return _this3.onEditorMouseDown(event);
      });
      this.eventManager.addEventListener(this.editor.getInputElement(), 'mouseup', function (event) {
        return _this3.onEditorMouseUp(event);
      });
    }
    /**
     * Sets the current cell range to be able to use general methods like {@link Comments#setComment}, {@link Comments#removeComment}, {@link Comments#show}.
     *
     * @param {Object} range Object with `from` property, each with `row` and `col` properties.
     */

  }, {
    key: "setRange",
    value: function setRange(range) {
      this.range = range;
    }
    /**
     * Clears the currently selected cell.
     */

  }, {
    key: "clearRange",
    value: function clearRange() {
      this.range = {};
    }
    /**
     * Checks if the event target is a cell containing a comment.
     *
     * @private
     * @param {Event} event DOM event
     * @returns {Boolean}
     */

  }, {
    key: "targetIsCellWithComment",
    value: function targetIsCellWithComment(event) {
      var closestCell = (0, _element.closest)(event.target, 'TD', 'TBODY');
      return !!(closestCell && (0, _element.hasClass)(closestCell, 'htCommentCell') && (0, _element.closest)(closestCell, [this.hot.rootElement]));
    }
    /**
     * Checks if the event target is a comment textarea.
     *
     * @private
     * @param {Event} event DOM event.
     * @returns {Boolean}
     */

  }, {
    key: "targetIsCommentTextArea",
    value: function targetIsCommentTextArea(event) {
      return this.editor.getInputElement() === event.target;
    }
    /**
     * Sets a comment for a cell according to the previously set range (see {@link Comments#setRange}).
     *
     * @param {String} value Comment contents.
     */

  }, {
    key: "setComment",
    value: function setComment(value) {
      if (!this.range.from) {
        throw new Error('Before using this method, first set cell range (hot.getPlugin("comment").setRange())');
      }

      var editorValue = this.editor.getValue();
      var comment = '';

      if (value !== null && value !== void 0) {
        comment = value;
      } else if (editorValue !== null && editorValue !== void 0) {
        comment = editorValue;
      }

      var row = this.range.from.row;
      var col = this.range.from.col;
      this.updateCommentMeta(row, col, _defineProperty({}, META_COMMENT_VALUE, comment));
      this.hot.render();
    }
    /**
     * Sets a comment for a specified cell.
     *
     * @param {Number} row Visual row index.
     * @param {Number} column Visual column index.
     * @param {String} value Comment contents.
     */

  }, {
    key: "setCommentAtCell",
    value: function setCommentAtCell(row, column, value) {
      this.setRange({
        from: new _src.CellCoords(row, column)
      });
      this.setComment(value);
    }
    /**
     * Removes a comment from a cell according to previously set range (see {@link Comments#setRange}).
     *
     * @param {Boolean} [forceRender=true] If set to `true`, the table will be re-rendered at the end of the operation.
     */

  }, {
    key: "removeComment",
    value: function removeComment() {
      var forceRender = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      if (!this.range.from) {
        throw new Error('Before using this method, first set cell range (hot.getPlugin("comment").setRange())');
      }

      this.hot.setCellMeta(this.range.from.row, this.range.from.col, META_COMMENT, void 0);

      if (forceRender) {
        this.hot.render();
      }

      this.hide();
    }
    /**
     * Removes a comment from a specified cell.
     *
     * @param {Number} row Visual row index.
     * @param {Number} column Visual column index.
     * @param {Boolean} [forceRender=true] If `true`, the table will be re-rendered at the end of the operation.
     */

  }, {
    key: "removeCommentAtCell",
    value: function removeCommentAtCell(row, column) {
      var forceRender = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      this.setRange({
        from: new _src.CellCoords(row, column)
      });
      this.removeComment(forceRender);
    }
    /**
     * Gets comment from a cell according to previously set range (see {@link Comments#setRange}).
     *
     * @returns {String|undefined} Returns a content of the comment.
     */

  }, {
    key: "getComment",
    value: function getComment() {
      var row = this.range.from.row;
      var column = this.range.from.col;
      return this.getCommentMeta(row, column, META_COMMENT_VALUE);
    }
    /**
     * Gets comment from a cell at the provided coordinates.
     *
     * @param {Number} row Visual row index.
     * @param {Number} column Visual column index.
     * @returns {String|undefined} Returns a content of the comment.
     */

  }, {
    key: "getCommentAtCell",
    value: function getCommentAtCell(row, column) {
      return this.getCommentMeta(row, column, META_COMMENT_VALUE);
    }
    /**
     * Shows the comment editor accordingly to the previously set range (see {@link Comments#setRange}).
     *
     * @returns {Boolean} Returns `true` if comment editor was shown.
     */

  }, {
    key: "show",
    value: function show() {
      if (!this.range.from) {
        throw new Error('Before using this method, first set cell range (hot.getPlugin("comment").setRange())');
      }

      var meta = this.hot.getCellMeta(this.range.from.row, this.range.from.col);
      this.refreshEditor(true);
      this.editor.setValue(meta[META_COMMENT] ? meta[META_COMMENT][META_COMMENT_VALUE] : null || '');

      if (this.editor.hidden) {
        this.editor.show();
      }

      return true;
    }
    /**
     * Shows comment editor according to cell coordinates.
     *
     * @param {Number} row Visual row index.
     * @param {Number} column Visual column index.
     * @returns {Boolean} Returns `true` if comment editor was shown.
     */

  }, {
    key: "showAtCell",
    value: function showAtCell(row, column) {
      this.setRange({
        from: new _src.CellCoords(row, column)
      });
      return this.show();
    }
    /**
     * Hides the comment editor.
     */

  }, {
    key: "hide",
    value: function hide() {
      if (!this.editor.hidden) {
        this.editor.hide();
      }
    }
    /**
     * Refreshes comment editor position and styling.
     *
     * @param {Boolean} [force=false] If `true` then recalculation will be forced.
     */

  }, {
    key: "refreshEditor",
    value: function refreshEditor() {
      var force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      if (!force && (!this.range.from || !this.editor.isVisible())) {
        return;
      }

      var rootWindow = this.hot.rootWindow;
      var _this$hot$view$wt = this.hot.view.wt,
          wtTable = _this$hot$view$wt.wtTable,
          wtOverlays = _this$hot$view$wt.wtOverlays,
          wtViewport = _this$hot$view$wt.wtViewport;
      var scrollableElement = wtOverlays.scrollableElement;
      var TD = wtTable.getCell(this.range.from);
      var row = this.range.from.row;
      var column = this.range.from.col;
      var cellOffset = (0, _element.offset)(TD);
      var lastColWidth = wtTable.getStretchedColumnWidth(column);
      var cellTopOffset = cellOffset.top < 0 ? 0 : cellOffset.top;
      var cellLeftOffset = cellOffset.left;

      if (wtViewport.hasVerticalScroll() && scrollableElement !== rootWindow) {
        cellTopOffset -= wtOverlays.topOverlay.getScrollPosition();
      }

      if (wtViewport.hasHorizontalScroll() && scrollableElement !== rootWindow) {
        cellLeftOffset -= wtOverlays.leftOverlay.getScrollPosition();
      }

      var x = cellLeftOffset + lastColWidth;
      var y = cellTopOffset;
      var commentStyle = this.getCommentMeta(row, column, META_STYLE);
      var readOnly = this.getCommentMeta(row, column, META_READONLY);

      if (commentStyle) {
        this.editor.setSize(commentStyle.width, commentStyle.height);
      } else {
        this.editor.resetSize();
      }

      this.editor.setReadOnlyState(readOnly);
      this.editor.setPosition(x, y);
    }
    /**
     * Checks if there is a comment for selected range.
     *
     * @private
     * @returns {Boolean}
     */

  }, {
    key: "checkSelectionCommentsConsistency",
    value: function checkSelectionCommentsConsistency() {
      var selected = this.hot.getSelectedRangeLast();

      if (!selected) {
        return false;
      }

      var hasComment = false;
      var cell = selected.from; // IN EXCEL THERE IS COMMENT ONLY FOR TOP LEFT CELL IN SELECTION

      if (this.getCommentMeta(cell.row, cell.col, META_COMMENT_VALUE)) {
        hasComment = true;
      }

      return hasComment;
    }
    /**
     * Sets or update the comment-related cell meta.
     *
     * @param {Number} row Visual row index.
     * @param {Number} column Visual column index.
     * @param {Object} metaObject Object defining all the comment-related meta information.
     */

  }, {
    key: "updateCommentMeta",
    value: function updateCommentMeta(row, column, metaObject) {
      var oldComment = this.hot.getCellMeta(row, column)[META_COMMENT];
      var newComment;

      if (oldComment) {
        newComment = (0, _object.deepClone)(oldComment);
        (0, _object.deepExtend)(newComment, metaObject);
      } else {
        newComment = metaObject;
      }

      this.hot.setCellMeta(row, column, META_COMMENT, newComment);
    }
    /**
     * Gets the comment related meta information.
     *
     * @param {Number} row Visual row index.
     * @param {Number} column Visual column index.
     * @param {String} property Cell meta property.
     * @returns {Mixed}
     */

  }, {
    key: "getCommentMeta",
    value: function getCommentMeta(row, column, property) {
      var cellMeta = this.hot.getCellMeta(row, column);

      if (!cellMeta[META_COMMENT]) {
        return void 0;
      }

      return cellMeta[META_COMMENT][property];
    }
    /**
     * `mousedown` event callback.
     *
     * @private
     * @param {MouseEvent} event The `mousedown` event.
     */

  }, {
    key: "onMouseDown",
    value: function onMouseDown(event) {
      this.mouseDown = true;

      if (!this.hot.view || !this.hot.view.wt) {
        return;
      }

      if (!this.contextMenuEvent && !this.targetIsCommentTextArea(event)) {
        var eventCell = (0, _element.closest)(event.target, 'TD', 'TBODY');
        var coordinates = null;

        if (eventCell) {
          coordinates = this.hot.view.wt.wtTable.getCoords(eventCell);
        }

        if (!eventCell || this.range.from && coordinates && (this.range.from.row !== coordinates.row || this.range.from.col !== coordinates.col)) {
          this.hide();
        }
      }

      this.contextMenuEvent = false;
    }
    /**
     * `mouseover` event callback.
     *
     * @private
     * @param {MouseEvent} event The `mouseover` event.
     */

  }, {
    key: "onMouseOver",
    value: function onMouseOver(event) {
      var priv = privatePool.get(this);
      var rootDocument = this.hot.rootDocument;
      priv.cellBelowCursor = rootDocument.elementFromPoint(event.clientX, event.clientY);

      if (this.mouseDown || this.editor.isFocused() || (0, _element.hasClass)(event.target, 'wtBorder') || priv.cellBelowCursor !== event.target || !this.editor) {
        return;
      }

      if (this.targetIsCellWithComment(event)) {
        var coordinates = this.hot.view.wt.wtTable.getCoords(event.target);
        var range = {
          from: new _src.CellCoords(coordinates.row, coordinates.col)
        };
        this.displaySwitch.show(range);
      } else if ((0, _element.isChildOf)(event.target, rootDocument) && !this.targetIsCommentTextArea(event)) {
        this.displaySwitch.hide();
      }
    }
    /**
     * `mouseup` event callback.
     *
     * @private
     */

  }, {
    key: "onMouseUp",
    value: function onMouseUp() {
      this.mouseDown = false;
    }
    /** *
     * The `afterRenderer` hook callback..
     *
     * @private
     * @param {HTMLTableCellElement} TD The rendered `TD` element.
     * @param {Object} cellProperties The rendered cell's property object.
     */

  }, {
    key: "onAfterRenderer",
    value: function onAfterRenderer(TD, cellProperties) {
      if (cellProperties[META_COMMENT] && cellProperties[META_COMMENT][META_COMMENT_VALUE]) {
        (0, _element.addClass)(TD, cellProperties.commentedCellClassName);
      }
    }
    /**
     * `blur` event callback for the comment editor.
     *
     * @private
     */

  }, {
    key: "onEditorBlur",
    value: function onEditorBlur() {
      this.setComment();
    }
    /**
     * `mousedown` hook. Along with `onEditorMouseUp` used to simulate the textarea resizing event.
     *
     * @private
     * @param {MouseEvent} event The `mousedown` event.
     */

  }, {
    key: "onEditorMouseDown",
    value: function onEditorMouseDown(event) {
      var priv = privatePool.get(this);
      priv.tempEditorDimensions = {
        width: (0, _element.outerWidth)(event.target),
        height: (0, _element.outerHeight)(event.target)
      };
    }
    /**
     * `mouseup` hook. Along with `onEditorMouseDown` used to simulate the textarea resizing event.
     *
     * @private
     * @param {MouseEvent} event The `mouseup` event.
     */

  }, {
    key: "onEditorMouseUp",
    value: function onEditorMouseUp(event) {
      var priv = privatePool.get(this);
      var currentWidth = (0, _element.outerWidth)(event.target);
      var currentHeight = (0, _element.outerHeight)(event.target);

      if (currentWidth !== priv.tempEditorDimensions.width + 1 || currentHeight !== priv.tempEditorDimensions.height + 2) {
        this.updateCommentMeta(this.range.from.row, this.range.from.col, _defineProperty({}, META_STYLE, {
          width: currentWidth,
          height: currentHeight
        }));
      }
    }
    /**
     * Context Menu's "Add comment" callback. Results in showing the comment editor.
     *
     * @private
     */

  }, {
    key: "onContextMenuAddComment",
    value: function onContextMenuAddComment() {
      var _this4 = this;

      this.displaySwitch.cancelHiding();
      var coords = this.hot.getSelectedRangeLast();
      this.contextMenuEvent = true;
      this.setRange({
        from: coords.from
      });
      this.show();
      setTimeout(function () {
        if (_this4.hot) {
          _this4.hot.deselectCell();

          _this4.editor.focus();
        }
      }, 10);
    }
    /**
     * Context Menu's "remove comment" callback.
     *
     * @private
     */

  }, {
    key: "onContextMenuRemoveComment",
    value: function onContextMenuRemoveComment() {
      var _this$hot$getSelected = this.hot.getSelectedRangeLast(),
          from = _this$hot$getSelected.from,
          to = _this$hot$getSelected.to;

      this.contextMenuEvent = true;

      for (var i = from.row; i <= to.row; i++) {
        for (var j = from.col; j <= to.col; j++) {
          this.removeCommentAtCell(i, j, false);
        }
      }

      this.hot.render();
    }
    /**
     * Context Menu's "make comment read-only" callback.
     *
     * @private
     */

  }, {
    key: "onContextMenuMakeReadOnly",
    value: function onContextMenuMakeReadOnly() {
      var _this$hot$getSelected2 = this.hot.getSelectedRangeLast(),
          from = _this$hot$getSelected2.from,
          to = _this$hot$getSelected2.to;

      this.contextMenuEvent = true;

      for (var i = from.row; i <= to.row; i++) {
        for (var j = from.col; j <= to.col; j++) {
          var currentState = !!this.getCommentMeta(i, j, META_READONLY);
          this.updateCommentMeta(i, j, _defineProperty({}, META_READONLY, !currentState));
        }
      }
    }
    /**
     * Add Comments plugin options to the Context Menu.
     *
     * @private
     * @param {Object} defaultOptions
     */

  }, {
    key: "addToContextMenu",
    value: function addToContextMenu(defaultOptions) {
      var _this5 = this;

      defaultOptions.items.push({
        name: '---------'
      }, {
        key: 'commentsAddEdit',
        name: function name() {
          if (_this5.checkSelectionCommentsConsistency()) {
            return _this5.hot.getTranslatedPhrase(C.CONTEXTMENU_ITEMS_EDIT_COMMENT);
          }

          return _this5.hot.getTranslatedPhrase(C.CONTEXTMENU_ITEMS_ADD_COMMENT);
        },
        callback: function callback() {
          return _this5.onContextMenuAddComment();
        },
        disabled: function disabled() {
          return !(this.getSelectedLast() && !this.selection.isSelectedByCorner());
        }
      }, {
        key: 'commentsRemove',
        name: function name() {
          return this.getTranslatedPhrase(C.CONTEXTMENU_ITEMS_REMOVE_COMMENT);
        },
        callback: function callback() {
          return _this5.onContextMenuRemoveComment();
        },
        disabled: function disabled() {
          return _this5.hot.selection.isSelectedByCorner();
        }
      }, {
        key: 'commentsReadOnly',
        name: function name() {
          var _this6 = this;

          var label = this.getTranslatedPhrase(C.CONTEXTMENU_ITEMS_READ_ONLY_COMMENT);
          var hasProperty = (0, _utils.checkSelectionConsistency)(this.getSelectedRangeLast(), function (row, col) {
            var readOnlyProperty = _this6.getCellMeta(row, col)[META_COMMENT];

            if (readOnlyProperty) {
              readOnlyProperty = readOnlyProperty[META_READONLY];
            }

            if (readOnlyProperty) {
              return true;
            }
          });

          if (hasProperty) {
            label = (0, _utils.markLabelAsSelected)(label);
          }

          return label;
        },
        callback: function callback() {
          return _this5.onContextMenuMakeReadOnly();
        },
        disabled: function disabled() {
          return _this5.hot.selection.isSelectedByCorner() || !_this5.checkSelectionCommentsConsistency();
        }
      });
    }
    /**
     * Get `displayDelay` setting of comment plugin.
     *
     * @private
     * @returns {Number|undefined}
     */

  }, {
    key: "getDisplayDelaySetting",
    value: function getDisplayDelaySetting() {
      var commentSetting = this.hot.getSettings().comments;

      if ((0, _object.isObject)(commentSetting)) {
        return commentSetting.displayDelay;
      }

      return void 0;
    }
    /**
     * `afterBeginEditing` hook callback.
     *
     * @private
     */

  }, {
    key: "onAfterBeginEditing",
    value: function onAfterBeginEditing() {
      this.hide();
    }
    /**
     * Destroys the plugin instance.
     */

  }, {
    key: "destroy",
    value: function destroy() {
      if (this.editor) {
        this.editor.destroy();
      }

      if (this.displaySwitch) {
        this.displaySwitch.destroy();
      }

      _get(_getPrototypeOf(Comments.prototype), "destroy", this).call(this);
    }
  }]);

  return Comments;
}(_base.default);

(0, _plugins.registerPlugin)('comments', Comments);
var _default = Comments;
exports.default = _default;