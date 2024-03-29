import "core-js/modules/es.symbol";
import "core-js/modules/es.symbol.description";
import "core-js/modules/es.symbol.iterator";
import "core-js/modules/es.array.iterator";
import "core-js/modules/es.object.to-string";
import "core-js/modules/es.string.iterator";
import "core-js/modules/es.weak-map";
import "core-js/modules/web.dom-collections.iterator";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

import { addClass, clearTextSelection, empty, fastInnerHTML, fastInnerText, getScrollbarWidth, hasClass, isChildOf, isInput, isOutsideInput } from './helpers/dom/element';
import EventManager from './eventManager';
import { stopPropagation, isImmediatePropagationStopped, isRightClick, isLeftClick } from './helpers/dom/event';
import Walkontable from './3rdparty/walkontable/src';
import { handleMouseEvent } from './selection/mouseEventHandler';
var privatePool = new WeakMap();
/**
 * @class TableView
 * @private
 */

var TableView =
/*#__PURE__*/
function () {
  /**
   * @param {Hanstontable} instance Instance of {@link Handsontable}
   */
  function TableView(instance) {
    _classCallCheck(this, TableView);

    /**
     * Instance of {@link Handsontable}
     *
     * @private
     * @type {Handsontable}
     */
    this.instance = instance;
    /**
     * Instance of {@link EventManager}
     *
     * @private
     * @type {EventManager}
     */

    this.eventManager = new EventManager(instance);
    /**
     * Current Handsontable's GridSettings object.
     *
     * @private
     * @type {GridSettings}
     */

    this.settings = instance.getSettings();
    /**
     * Main <THEAD> element.
     *
     * @type {HTMLTableSectionElement}
     */

    this.THEAD = void 0;
    /**
     * Main <TBODY> element.
     *
     * @type {HTMLTableSectionElement}
     */

    this.TBODY = void 0;
    /**
     * Main Walkontable instance.
     *
     * @type {Walkontable}
     */

    this.wt = void 0;
    /**
     * Main Walkontable instance.
     *
     * @private
     * @type {Walkontable}
     */

    this.activeWt = void 0;
    privatePool.set(this, {
      /**
       * Defines if the text should be selected during mousemove.
       *
       * @private
       * @type {Boolean}
       */
      selectionMouseDown: false,

      /**
       * @private
       * @type {Boolean}
       */
      mouseDown: void 0,

      /**
       * Main <TABLE> element.
       *
       * @private
       * @type {HTMLTableElement}
       */
      table: void 0,

      /**
       * Cached width of the rootElement.
       *
       * @type {Number}
       */
      lastWidth: 0,

      /**
       * Cached height of the rootElement.
       *
       * @type {Number}
       */
      lastHeight: 0
    });
    this.createElements();
    this.registerEvents();
    this.initializeWalkontable();
  }
  /**
   * Renders WalkontableUI.
   */


  _createClass(TableView, [{
    key: "render",
    value: function render() {
      this.wt.draw(!this.instance.forceFullRender);
      this.instance.forceFullRender = false;
      this.instance.renderCall = false;
    }
    /**
     * Returns td object given coordinates
     *
     * @param {CellCoords} coords
     * @param {Boolean} topmost
     * @returns {HTMLTableCellElement|null}
     */

  }, {
    key: "getCellAtCoords",
    value: function getCellAtCoords(coords, topmost) {
      var td = this.wt.getCell(coords, topmost);

      if (td < 0) {
        // there was an exit code (cell is out of bounds)
        return null;
      }

      return td;
    }
    /**
     * Scroll viewport to a cell.
     *
     * @param {CellCoords} coords
     * @param {Boolean} [snapToTop]
     * @param {Boolean} [snapToRight]
     * @param {Boolean} [snapToBottom]
     * @param {Boolean} [snapToLeft]
     * @returns {Boolean}
     */

  }, {
    key: "scrollViewport",
    value: function scrollViewport(coords, snapToTop, snapToRight, snapToBottom, snapToLeft) {
      return this.wt.scrollViewport(coords, snapToTop, snapToRight, snapToBottom, snapToLeft);
    }
    /**
     * Scroll viewport to a column.
     *
     * @param {Number} column Visual column index.
     * @param {Boolean} [snapToLeft]
     * @param {Boolean} [snapToRight]
     * @returns {Boolean}
     */

  }, {
    key: "scrollViewportHorizontally",
    value: function scrollViewportHorizontally(column, snapToRight, snapToLeft) {
      return this.wt.scrollViewportHorizontally(column, snapToRight, snapToLeft);
    }
    /**
     * Scroll viewport to a row.
     *
     * @param {Number} row Visual row index.
     * @param {Boolean} [snapToTop]
     * @param {Boolean} [snapToBottom]
     * @returns {Boolean}
     */

  }, {
    key: "scrollViewportVertically",
    value: function scrollViewportVertically(row, snapToTop, snapToBottom) {
      return this.wt.scrollViewportVertically(row, snapToTop, snapToBottom);
    }
    /**
     * Updates header cell content.
     *
     * @since 0.15.0-beta4
     * @param {HTMLElement} element Element to update
     * @param {Number} index Row index or column index
     * @param {Function} content Function which should be returns content for this cell
     */

  }, {
    key: "updateCellHeader",
    value: function updateCellHeader(element, index, content) {
      var renderedIndex = index;
      var parentOverlay = this.wt.wtOverlays.getParentOverlay(element) || this.wt; // prevent wrong calculations from SampleGenerator

      if (element.parentNode) {
        if (hasClass(element, 'colHeader')) {
          renderedIndex = parentOverlay.wtTable.columnFilter.sourceToRendered(index);
        } else if (hasClass(element, 'rowHeader')) {
          renderedIndex = parentOverlay.wtTable.rowFilter.sourceToRendered(index);
        }
      }

      if (renderedIndex > -1) {
        fastInnerHTML(element, content(index));
      } else {
        // workaround for https://github.com/handsontable/handsontable/issues/1946
        fastInnerText(element, String.fromCharCode(160));
        addClass(element, 'cornerHeader');
      }
    }
    /**
     * Prepares DOMElements and adds correct className to the root element.
     *
     * @private
     */

  }, {
    key: "createElements",
    value: function createElements() {
      var priv = privatePool.get(this);
      var _this$instance = this.instance,
          rootElement = _this$instance.rootElement,
          rootDocument = _this$instance.rootDocument;
      var originalStyle = rootElement.getAttribute('style');

      if (originalStyle) {
        rootElement.setAttribute('data-originalstyle', originalStyle); // needed to retrieve original style in jsFiddle link generator in HT examples. may be removed in future versions
      }

      addClass(rootElement, 'handsontable');
      priv.table = rootDocument.createElement('TABLE');
      addClass(priv.table, 'htCore');

      if (this.instance.getSettings().tableClassName) {
        addClass(priv.table, this.instance.getSettings().tableClassName);
      }

      this.THEAD = rootDocument.createElement('THEAD');
      priv.table.appendChild(this.THEAD);
      this.TBODY = rootDocument.createElement('TBODY');
      priv.table.appendChild(this.TBODY);
      this.instance.table = priv.table;
      this.instance.container.insertBefore(priv.table, this.instance.container.firstChild);
    }
    /**
     * Attaches necessary listeners.
     *
     * @private
     */

  }, {
    key: "registerEvents",
    value: function registerEvents() {
      var _this = this;

      var priv = privatePool.get(this);
      var _this$instance2 = this.instance,
          rootElement = _this$instance2.rootElement,
          rootDocument = _this$instance2.rootDocument;
      var documentElement = rootDocument.documentElement;
      this.eventManager.addEventListener(rootElement, 'mousedown', function (event) {
        priv.selectionMouseDown = true;

        if (!_this.isTextSelectionAllowed(event.target)) {
          var rootWindow = _this.instance.rootWindow;
          clearTextSelection(rootWindow);
          event.preventDefault();
          rootWindow.focus(); // make sure that window that contains HOT is active. Important when HOT is in iframe.
        }
      });
      this.eventManager.addEventListener(rootElement, 'mouseup', function () {
        priv.selectionMouseDown = false;
      });
      this.eventManager.addEventListener(rootElement, 'mousemove', function (event) {
        if (priv.selectionMouseDown && !_this.isTextSelectionAllowed(event.target)) {
          // Clear selection only when fragmentSelection is enabled, otherwise clearing selection breakes the IME editor.
          if (_this.settings.fragmentSelection) {
            clearTextSelection(_this.instance.rootWindow);
          }

          event.preventDefault();
        }
      });
      this.eventManager.addEventListener(documentElement, 'keyup', function (event) {
        if (_this.instance.selection.isInProgress() && !event.shiftKey) {
          _this.instance.selection.finish();
        }
      });
      this.eventManager.addEventListener(documentElement, 'mouseup', function (event) {
        if (_this.instance.selection.isInProgress() && isLeftClick(event)) {
          // is left mouse button
          _this.instance.selection.finish();
        }

        priv.mouseDown = false;

        if (isOutsideInput(rootDocument.activeElement) || !_this.instance.selection.isSelected() && !isRightClick(event)) {
          _this.instance.unlisten();
        }
      });
      this.eventManager.addEventListener(documentElement, 'contextmenu', function (event) {
        if (_this.instance.selection.isInProgress() && isRightClick(event)) {
          _this.instance.selection.finish();

          priv.mouseDown = false;
        }
      });
      this.eventManager.addEventListener(documentElement, 'touchend', function () {
        if (_this.instance.selection.isInProgress()) {
          _this.instance.selection.finish();
        }

        priv.mouseDown = false;
      });
      this.eventManager.addEventListener(documentElement, 'mousedown', function (event) {
        var originalTarget = event.target;
        var eventX = event.x || event.clientX;
        var eventY = event.y || event.clientY;
        var next = event.target;

        if (priv.mouseDown || !rootElement || !_this.instance.view) {
          return; // it must have been started in a cell
        } // immediate click on "holder" means click on the right side of vertical scrollbar


        var holder = _this.instance.view.wt.wtTable.holder;

        if (next === holder) {
          var scrollbarWidth = getScrollbarWidth(rootDocument);

          if (rootDocument.elementFromPoint(eventX + scrollbarWidth, eventY) !== holder || rootDocument.elementFromPoint(eventX, eventY + scrollbarWidth) !== holder) {
            return;
          }
        } else {
          while (next !== documentElement) {
            if (next === null) {
              if (event.isTargetWebComponent) {
                break;
              } // click on something that was a row but now is detached (possibly because your click triggered a rerender)


              return;
            }

            if (next === rootElement) {
              // click inside container
              return;
            }

            next = next.parentNode;
          }
        } // function did not return until here, we have an outside click!


        var outsideClickDeselects = typeof _this.settings.outsideClickDeselects === 'function' ? _this.settings.outsideClickDeselects(originalTarget) : _this.settings.outsideClickDeselects;

        if (outsideClickDeselects) {
          _this.instance.deselectCell();
        } else {
          _this.instance.destroyEditor(false, false);
        }
      });
      this.eventManager.addEventListener(priv.table, 'selectstart', function (event) {
        if (_this.settings.fragmentSelection || isInput(event.target)) {
          return;
        } // https://github.com/handsontable/handsontable/issues/160
        // Prevent text from being selected when performing drag down.


        event.preventDefault();
      });
    }
    /**
     * Defines default configuration and initializes WalkOnTable intance.
     *
     * @private
     */

  }, {
    key: "initializeWalkontable",
    value: function initializeWalkontable() {
      var _this2 = this;

      var priv = privatePool.get(this);
      var walkontableConfig = {
        debug: function debug() {
          return _this2.settings.debug;
        },
        externalRowCalculator: this.instance.getPlugin('autoRowSize') && this.instance.getPlugin('autoRowSize').isEnabled(),
        table: priv.table,
        preventOverflow: function preventOverflow() {
          return _this2.settings.preventOverflow;
        },
        stretchH: function stretchH() {
          return _this2.settings.stretchH;
        },
        data: this.instance.getDataAtCell,
        totalRows: function totalRows() {
          return _this2.instance.countRows();
        },
        totalColumns: function totalColumns() {
          return _this2.instance.countCols();
        },
        fixedColumnsLeft: function fixedColumnsLeft() {
          return _this2.settings.fixedColumnsLeft;
        },
        fixedRowsTop: function fixedRowsTop() {
          return _this2.settings.fixedRowsTop;
        },
        fixedRowsBottom: function fixedRowsBottom() {
          return _this2.settings.fixedRowsBottom;
        },
        minSpareRows: function minSpareRows() {
          return _this2.settings.minSpareRows;
        },
        renderAllRows: this.settings.renderAllRows,
        rowHeaders: function rowHeaders() {
          var headerRenderers = [];

          if (_this2.instance.hasRowHeaders()) {
            headerRenderers.push(function (row, TH) {
              return _this2.appendRowHeader(row, TH);
            });
          }

          _this2.instance.runHooks('afterGetRowHeaderRenderers', headerRenderers);

          return headerRenderers;
        },
        columnHeaders: function columnHeaders() {
          var headerRenderers = [];

          if (_this2.instance.hasColHeaders()) {
            headerRenderers.push(function (column, TH) {
              _this2.appendColHeader(column, TH);
            });
          }

          _this2.instance.runHooks('afterGetColumnHeaderRenderers', headerRenderers);

          return headerRenderers;
        },
        columnWidth: this.instance.getColWidth,
        rowHeight: this.instance.getRowHeight,
        cellRenderer: function cellRenderer(row, col, TD) {
          var cellProperties = _this2.instance.getCellMeta(row, col);

          var prop = _this2.instance.colToProp(col);

          var value = _this2.instance.getDataAtRowProp(row, prop);

          if (_this2.instance.hasHook('beforeValueRender')) {
            value = _this2.instance.runHooks('beforeValueRender', value, cellProperties);
          }

          _this2.instance.runHooks('beforeRenderer', TD, row, col, prop, value, cellProperties);

          _this2.instance.getCellRenderer(cellProperties)(_this2.instance, TD, row, col, prop, value, cellProperties);

          _this2.instance.runHooks('afterRenderer', TD, row, col, prop, value, cellProperties);
        },
        selections: this.instance.selection.highlight,
        hideBorderOnMouseDownOver: function hideBorderOnMouseDownOver() {
          return _this2.settings.fragmentSelection;
        },
        onWindowResize: function onWindowResize() {
          if (!_this2.instance || _this2.instance.isDestroyed) {
            return;
          }

          _this2.instance.refreshDimensions();
        },
        onCellMouseDown: function onCellMouseDown(event, coords, TD, wt) {
          var blockCalculations = {
            row: false,
            column: false,
            cell: false
          };

          _this2.instance.listen();

          _this2.activeWt = wt;
          priv.mouseDown = true;

          _this2.instance.runHooks('beforeOnCellMouseDown', event, coords, TD, blockCalculations);

          if (isImmediatePropagationStopped(event)) {
            return;
          }

          handleMouseEvent(event, {
            coords: coords,
            selection: _this2.instance.selection,
            controller: blockCalculations
          });

          _this2.instance.runHooks('afterOnCellMouseDown', event, coords, TD);

          _this2.activeWt = _this2.wt;
        },
        onCellContextMenu: function onCellContextMenu(event, coords, TD, wt) {
          _this2.activeWt = wt;
          priv.mouseDown = false;

          if (_this2.instance.selection.isInProgress()) {
            _this2.instance.selection.finish();
          }

          _this2.instance.runHooks('beforeOnCellContextMenu', event, coords, TD);

          if (isImmediatePropagationStopped(event)) {
            return;
          }

          _this2.instance.runHooks('afterOnCellContextMenu', event, coords, TD);

          _this2.activeWt = _this2.wt;
        },
        onCellMouseOut: function onCellMouseOut(event, coords, TD, wt) {
          _this2.activeWt = wt;

          _this2.instance.runHooks('beforeOnCellMouseOut', event, coords, TD);

          if (isImmediatePropagationStopped(event)) {
            return;
          }

          _this2.instance.runHooks('afterOnCellMouseOut', event, coords, TD);

          _this2.activeWt = _this2.wt;
        },
        onCellMouseOver: function onCellMouseOver(event, coords, TD, wt) {
          var blockCalculations = {
            row: false,
            column: false,
            cell: false
          };
          _this2.activeWt = wt;

          _this2.instance.runHooks('beforeOnCellMouseOver', event, coords, TD, blockCalculations);

          if (isImmediatePropagationStopped(event)) {
            return;
          }

          if (priv.mouseDown) {
            handleMouseEvent(event, {
              coords: coords,
              selection: _this2.instance.selection,
              controller: blockCalculations
            });
          }

          _this2.instance.runHooks('afterOnCellMouseOver', event, coords, TD);

          _this2.activeWt = _this2.wt;
        },
        onCellMouseUp: function onCellMouseUp(event, coords, TD, wt) {
          _this2.activeWt = wt;

          _this2.instance.runHooks('beforeOnCellMouseUp', event, coords, TD);

          _this2.instance.runHooks('afterOnCellMouseUp', event, coords, TD);

          _this2.activeWt = _this2.wt;
        },
        onCellCornerMouseDown: function onCellCornerMouseDown(event) {
          event.preventDefault();

          _this2.instance.runHooks('afterOnCellCornerMouseDown', event);
        },
        onCellCornerDblClick: function onCellCornerDblClick(event) {
          event.preventDefault();

          _this2.instance.runHooks('afterOnCellCornerDblClick', event);
        },
        beforeDraw: function beforeDraw(force, skipRender) {
          return _this2.beforeRender(force, skipRender);
        },
        onDraw: function onDraw(force) {
          return _this2.onDraw(force);
        },
        onScrollVertically: function onScrollVertically() {
          return _this2.instance.runHooks('afterScrollVertically');
        },
        onScrollHorizontally: function onScrollHorizontally() {
          return _this2.instance.runHooks('afterScrollHorizontally');
        },
        onBeforeRemoveCellClassNames: function onBeforeRemoveCellClassNames() {
          return _this2.instance.runHooks('beforeRemoveCellClassNames');
        },
        onAfterDrawSelection: function onAfterDrawSelection(currentRow, currentColumn, cornersOfSelection, layerLevel) {
          return _this2.instance.runHooks('afterDrawSelection', currentRow, currentColumn, cornersOfSelection, layerLevel);
        },
        onBeforeDrawBorders: function onBeforeDrawBorders(corners, borderClassName) {
          return _this2.instance.runHooks('beforeDrawBorders', corners, borderClassName);
        },
        onBeforeTouchScroll: function onBeforeTouchScroll() {
          return _this2.instance.runHooks('beforeTouchScroll');
        },
        onAfterMomentumScroll: function onAfterMomentumScroll() {
          return _this2.instance.runHooks('afterMomentumScroll');
        },
        onBeforeStretchingColumnWidth: function onBeforeStretchingColumnWidth(stretchedWidth, column) {
          return _this2.instance.runHooks('beforeStretchingColumnWidth', stretchedWidth, column);
        },
        onModifyRowHeaderWidth: function onModifyRowHeaderWidth(rowHeaderWidth) {
          return _this2.instance.runHooks('modifyRowHeaderWidth', rowHeaderWidth);
        },
        onModifyGetCellCoords: function onModifyGetCellCoords(row, column, topmost) {
          return _this2.instance.runHooks('modifyGetCellCoords', row, column, topmost);
        },
        viewportRowCalculatorOverride: function viewportRowCalculatorOverride(calc) {
          var rows = _this2.instance.countRows();

          var viewportOffset = _this2.settings.viewportRowRenderingOffset;

          if (viewportOffset === 'auto' && _this2.settings.fixedRowsTop) {
            viewportOffset = 10;
          }

          if (typeof viewportOffset === 'number') {
            calc.startRow = Math.max(calc.startRow - viewportOffset, 0);
            calc.endRow = Math.min(calc.endRow + viewportOffset, rows - 1);
          }

          if (viewportOffset === 'auto') {
            var center = calc.startRow + calc.endRow - calc.startRow;
            var offset = Math.ceil(center / rows * 12);
            calc.startRow = Math.max(calc.startRow - offset, 0);
            calc.endRow = Math.min(calc.endRow + offset, rows - 1);
          }

          _this2.instance.runHooks('afterViewportRowCalculatorOverride', calc);
        },
        viewportColumnCalculatorOverride: function viewportColumnCalculatorOverride(calc) {
          var cols = _this2.instance.countCols();

          var viewportOffset = _this2.settings.viewportColumnRenderingOffset;

          if (viewportOffset === 'auto' && _this2.settings.fixedColumnsLeft) {
            viewportOffset = 10;
          }

          if (typeof viewportOffset === 'number') {
            calc.startColumn = Math.max(calc.startColumn - viewportOffset, 0);
            calc.endColumn = Math.min(calc.endColumn + viewportOffset, cols - 1);
          }

          if (viewportOffset === 'auto') {
            var center = calc.startColumn + calc.endColumn - calc.startColumn;
            var offset = Math.ceil(center / cols * 12);
            calc.startRow = Math.max(calc.startColumn - offset, 0);
            calc.endColumn = Math.min(calc.endColumn + offset, cols - 1);
          }

          _this2.instance.runHooks('afterViewportColumnCalculatorOverride', calc);
        },
        rowHeaderWidth: function rowHeaderWidth() {
          return _this2.settings.rowHeaderWidth;
        },
        columnHeaderHeight: function columnHeaderHeight() {
          var columnHeaderHeight = _this2.instance.runHooks('modifyColumnHeaderHeight');

          return _this2.settings.columnHeaderHeight || columnHeaderHeight;
        }
      };
      this.instance.runHooks('beforeInitWalkontable', walkontableConfig);
      this.wt = new Walkontable(walkontableConfig);
      this.activeWt = this.wt;
      var spreader = this.wt.wtTable.spreader; // We have to cache width and height after Walkontable initialization.

      var _this$instance$rootEl = this.instance.rootElement.getBoundingClientRect(),
          width = _this$instance$rootEl.width,
          height = _this$instance$rootEl.height;

      this.setLastSize(width, height);
      this.eventManager.addEventListener(spreader, 'mousedown', function (event) {
        // right mouse button exactly on spreader means right click on the right hand side of vertical scrollbar
        if (event.target === spreader && event.which === 3) {
          stopPropagation(event);
        }
      });
      this.eventManager.addEventListener(spreader, 'contextmenu', function (event) {
        // right mouse button exactly on spreader means right click on the right hand side of vertical scrollbar
        if (event.target === spreader && event.which === 3) {
          stopPropagation(event);
        }
      });
      this.eventManager.addEventListener(this.instance.rootDocument.documentElement, 'click', function () {
        if (_this2.settings.observeDOMVisibility) {
          if (_this2.wt.drawInterrupted) {
            _this2.instance.forceFullRender = true;

            _this2.render();
          }
        }
      });
    }
    /**
     * Checks if it's possible to create text selection in element.
     *
     * @private
     * @param {HTMLElement} el
     * @returns {Boolean}
     */

  }, {
    key: "isTextSelectionAllowed",
    value: function isTextSelectionAllowed(el) {
      if (isInput(el)) {
        return true;
      }

      var isChildOfTableBody = isChildOf(el, this.instance.view.wt.wtTable.spreader);

      if (this.settings.fragmentSelection === true && isChildOfTableBody) {
        return true;
      }

      if (this.settings.fragmentSelection === 'cell' && this.isSelectedOnlyCell() && isChildOfTableBody) {
        return true;
      }

      if (!this.settings.fragmentSelection && this.isCellEdited() && this.isSelectedOnlyCell()) {
        return true;
      }

      return false;
    }
    /**
     * Checks if user's been called mousedown.
     *
     * @private
     * @returns {Boolean}
     */

  }, {
    key: "isMouseDown",
    value: function isMouseDown() {
      return privatePool.get(this).mouseDown;
    }
    /**
     * Check if selected only one cell.
     *
     * @private
     * @returns {Boolean}
     */

  }, {
    key: "isSelectedOnlyCell",
    value: function isSelectedOnlyCell() {
      var _ref = this.instance.getSelectedLast() || [],
          _ref2 = _slicedToArray(_ref, 4),
          row = _ref2[0],
          col = _ref2[1],
          rowEnd = _ref2[2],
          colEnd = _ref2[3];

      return row !== void 0 && row === rowEnd && col === colEnd;
    }
    /**
     * Checks if active cell is editing.
     *
     * @private
     * @returns {Boolean}
     */

  }, {
    key: "isCellEdited",
    value: function isCellEdited() {
      var activeEditor = this.instance.getActiveEditor();
      return activeEditor && activeEditor.isOpened();
    }
    /**
     * `beforeDraw` callback.
     *
     * @private
     * @param {Boolean} force
     * @param {Boolean} skipRender
     */

  }, {
    key: "beforeRender",
    value: function beforeRender(force, skipRender) {
      if (force) {
        // this.instance.forceFullRender = did Handsontable request full render?
        this.instance.runHooks('beforeRender', this.instance.forceFullRender, skipRender);
      }
    }
    /**
     * `onDraw` callback.
     *
     * @private
     * @param {Boolean} force
     */

  }, {
    key: "onDraw",
    value: function onDraw(force) {
      if (force) {
        // this.instance.forceFullRender = did Handsontable request full render?
        this.instance.runHooks('afterRender', this.instance.forceFullRender);
      }
    }
    /**
     * Append row header to a TH element
     *
     * @private
     * @param row
     * @param TH
     */

  }, {
    key: "appendRowHeader",
    value: function appendRowHeader(row, TH) {
      if (TH.firstChild) {
        var container = TH.firstChild;

        if (!hasClass(container, 'relative')) {
          empty(TH);
          this.appendRowHeader(row, TH);
          return;
        }

        this.updateCellHeader(container.querySelector('.rowHeader'), row, this.instance.getRowHeader);
      } else {
        var _this$instance3 = this.instance,
            rootDocument = _this$instance3.rootDocument,
            getRowHeader = _this$instance3.getRowHeader;
        var div = rootDocument.createElement('div');
        var span = rootDocument.createElement('span');
        div.className = 'relative';
        span.className = 'rowHeader';
        this.updateCellHeader(span, row, getRowHeader);
        div.appendChild(span);
        TH.appendChild(div);
      }

      this.instance.runHooks('afterGetRowHeader', row, TH);
    }
    /**
     * Append column header to a TH element
     *
     * @private
     * @param col
     * @param TH
     */

  }, {
    key: "appendColHeader",
    value: function appendColHeader(col, TH) {
      if (TH.firstChild) {
        var container = TH.firstChild;

        if (hasClass(container, 'relative')) {
          this.updateCellHeader(container.querySelector('.colHeader'), col, this.instance.getColHeader);
        } else {
          empty(TH);
          this.appendColHeader(col, TH);
        }
      } else {
        var rootDocument = this.instance.rootDocument;
        var div = rootDocument.createElement('div');
        var span = rootDocument.createElement('span');
        div.className = 'relative';
        span.className = 'colHeader';
        this.updateCellHeader(span, col, this.instance.getColHeader);
        div.appendChild(span);
        TH.appendChild(div);
      }

      this.instance.runHooks('afterGetColHeader', col, TH);
    }
    /**
     * Given a element's left position relative to the viewport, returns maximum element width until the right
     * edge of the viewport (before scrollbar)
     *
     * @private
     * @param {Number} leftOffset
     * @return {Number}
     */

  }, {
    key: "maximumVisibleElementWidth",
    value: function maximumVisibleElementWidth(leftOffset) {
      var workspaceWidth = this.wt.wtViewport.getWorkspaceWidth();
      var maxWidth = workspaceWidth - leftOffset;
      return maxWidth > 0 ? maxWidth : 0;
    }
    /**
     * Given a element's top position relative to the viewport, returns maximum element height until the bottom
     * edge of the viewport (before scrollbar)
     *
     * @private
     * @param {Number} topOffset
     * @return {Number}
     */

  }, {
    key: "maximumVisibleElementHeight",
    value: function maximumVisibleElementHeight(topOffset) {
      var workspaceHeight = this.wt.wtViewport.getWorkspaceHeight();
      var maxHeight = workspaceHeight - topOffset;
      return maxHeight > 0 ? maxHeight : 0;
    }
    /**
     * Sets new dimensions of the container.
     */

  }, {
    key: "setLastSize",
    value: function setLastSize(width, height) {
      var priv = privatePool.get(this);
      var _ref3 = [width, height];
      priv.lastWidth = _ref3[0];
      priv.lastHeight = _ref3[1];
    }
    /**
     * Returns cached dimensions.
     */

  }, {
    key: "getLastSize",
    value: function getLastSize() {
      var priv = privatePool.get(this);
      return {
        width: priv.lastWidth,
        height: priv.lastHeight
      };
    }
    /**
     * Checks if master overlay is active.
     *
     * @private
     * @returns {Boolean}
     */

  }, {
    key: "mainViewIsActive",
    value: function mainViewIsActive() {
      return this.wt === this.activeWt;
    }
    /**
     * Destroyes internal WalkOnTable's instance. Detaches all of the bonded listeners.
     *
     * @private
     */

  }, {
    key: "destroy",
    value: function destroy() {
      this.wt.destroy();
      this.eventManager.destroy();
    }
  }]);

  return TableView;
}();

export default TableView;