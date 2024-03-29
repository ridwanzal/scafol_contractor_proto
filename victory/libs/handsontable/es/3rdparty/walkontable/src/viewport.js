function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

import { getScrollbarWidth, getStyle, offset, outerHeight, outerWidth } from './../../../helpers/dom/element';
import { objectEach } from './../../../helpers/object';
import EventManager from './../../../eventManager';
import ViewportColumnsCalculator from './calculator/viewportColumns';
import ViewportRowsCalculator from './calculator/viewportRows';
/**
 * @class Viewport
 */

var Viewport =
/*#__PURE__*/
function () {
  /**
   * @param wotInstance
   */
  function Viewport(wotInstance) {
    var _this = this;

    _classCallCheck(this, Viewport);

    this.wot = wotInstance; // legacy support

    this.instance = this.wot;
    this.oversizedRows = [];
    this.oversizedColumnHeaders = [];
    this.hasOversizedColumnHeadersMarked = {};
    this.clientHeight = 0;
    this.containerWidth = NaN;
    this.rowHeaderWidth = NaN;
    this.rowsVisibleCalculator = null;
    this.columnsVisibleCalculator = null;
    this.eventManager = new EventManager(this.wot);
    this.eventManager.addEventListener(this.wot.rootWindow, 'resize', function () {
      _this.clientHeight = _this.getWorkspaceHeight();
    });
  }
  /**
   * @returns {number}
   */


  _createClass(Viewport, [{
    key: "getWorkspaceHeight",
    value: function getWorkspaceHeight() {
      var currentDocument = this.wot.rootDocument;
      var trimmingContainer = this.instance.wtOverlays.topOverlay.trimmingContainer;
      var elemHeight;
      var height = 0;

      if (trimmingContainer === this.wot.rootWindow) {
        height = currentDocument.documentElement.clientHeight;
      } else {
        elemHeight = outerHeight(trimmingContainer); // returns height without DIV scrollbar

        height = elemHeight > 0 && trimmingContainer.clientHeight > 0 ? trimmingContainer.clientHeight : Infinity;
      }

      return height;
    }
  }, {
    key: "getWorkspaceWidth",
    value: function getWorkspaceWidth() {
      var wot = this.wot;
      var rootDocument = wot.rootDocument,
          rootWindow = wot.rootWindow;
      var trimmingContainer = this.instance.wtOverlays.leftOverlay.trimmingContainer;
      var docOffsetWidth = rootDocument.documentElement.offsetWidth;
      var totalColumns = wot.getSetting('totalColumns');
      var stretchSetting = wot.getSetting('stretchH');
      var preventOverflow = wot.getSetting('preventOverflow');
      var width;
      var overflow;

      if (preventOverflow) {
        return outerWidth(this.instance.wtTable.wtRootElement);
      }

      if (wot.getSetting('freezeOverlays')) {
        width = Math.min(docOffsetWidth - this.getWorkspaceOffset().left, docOffsetWidth);
      } else {
        width = Math.min(this.getContainerFillWidth(), docOffsetWidth - this.getWorkspaceOffset().left, docOffsetWidth);
      }

      if (trimmingContainer === rootWindow && totalColumns > 0 && this.sumColumnWidths(0, totalColumns - 1) > width) {
        // in case sum of column widths is higher than available stylesheet width, let's assume using the whole window
        // otherwise continue below, which will allow stretching
        // this is used in `scroll_window.html`
        // TODO test me
        return rootDocument.documentElement.clientWidth;
      }

      if (trimmingContainer !== rootWindow) {
        overflow = getStyle(this.instance.wtOverlays.leftOverlay.trimmingContainer, 'overflow', rootWindow);

        if (overflow === 'scroll' || overflow === 'hidden' || overflow === 'auto') {
          // this is used in `scroll.html`
          // TODO test me
          return Math.max(width, trimmingContainer.clientWidth);
        }
      }

      if (stretchSetting === 'none' || !stretchSetting) {
        // if no stretching is used, return the maximum used workspace width
        return Math.max(width, outerWidth(this.instance.wtTable.TABLE));
      } // if stretching is used, return the actual container width, so the columns can fit inside it


      return width;
    }
    /**
     * Checks if viewport has vertical scroll
     *
     * @returns {Boolean}
     */

  }, {
    key: "hasVerticalScroll",
    value: function hasVerticalScroll() {
      return this.getWorkspaceActualHeight() > this.getWorkspaceHeight();
    }
    /**
     * Checks if viewport has horizontal scroll
     *
     * @returns {Boolean}
     */

  }, {
    key: "hasHorizontalScroll",
    value: function hasHorizontalScroll() {
      return this.getWorkspaceActualWidth() > this.getWorkspaceWidth();
    }
    /**
     * @param from
     * @param length
     * @returns {Number}
     */

  }, {
    key: "sumColumnWidths",
    value: function sumColumnWidths(from, length) {
      var wtTable = this.wot.wtTable;
      var sum = 0;
      var column = from;

      while (column < length) {
        sum += wtTable.getColumnWidth(column);
        column += 1;
      }

      return sum;
    }
    /**
     * @returns {Number}
     */

  }, {
    key: "getContainerFillWidth",
    value: function getContainerFillWidth() {
      if (this.containerWidth) {
        return this.containerWidth;
      }

      var mainContainer = this.instance.wtTable.holder;
      var dummyElement = this.wot.rootDocument.createElement('div');
      dummyElement.style.width = '100%';
      dummyElement.style.height = '1px';
      mainContainer.appendChild(dummyElement);
      var fillWidth = dummyElement.offsetWidth;
      this.containerWidth = fillWidth;
      mainContainer.removeChild(dummyElement);
      return fillWidth;
    }
    /**
     * @returns {Number}
     */

  }, {
    key: "getWorkspaceOffset",
    value: function getWorkspaceOffset() {
      return offset(this.wot.wtTable.TABLE);
    }
    /**
     * @returns {Number}
     */

  }, {
    key: "getWorkspaceActualHeight",
    value: function getWorkspaceActualHeight() {
      return outerHeight(this.wot.wtTable.TABLE);
    }
    /**
     * @returns {Number}
     */

  }, {
    key: "getWorkspaceActualWidth",
    value: function getWorkspaceActualWidth() {
      var wtTable = this.wot.wtTable;
      return outerWidth(wtTable.TABLE) || outerWidth(wtTable.TBODY) || outerWidth(wtTable.THEAD); // IE8 reports 0 as <table> offsetWidth;
    }
    /**
     * @returns {Number}
     */

  }, {
    key: "getColumnHeaderHeight",
    value: function getColumnHeaderHeight() {
      var columnHeaders = this.instance.getSetting('columnHeaders');

      if (!columnHeaders.length) {
        this.columnHeaderHeight = 0;
      } else if (isNaN(this.columnHeaderHeight)) {
        this.columnHeaderHeight = outerHeight(this.wot.wtTable.THEAD);
      }

      return this.columnHeaderHeight;
    }
    /**
     * @returns {Number}
     */

  }, {
    key: "getViewportHeight",
    value: function getViewportHeight() {
      var containerHeight = this.getWorkspaceHeight();

      if (containerHeight === Infinity) {
        return containerHeight;
      }

      var columnHeaderHeight = this.getColumnHeaderHeight();

      if (columnHeaderHeight > 0) {
        containerHeight -= columnHeaderHeight;
      }

      return containerHeight;
    }
    /**
     * @returns {Number}
     */

  }, {
    key: "getRowHeaderWidth",
    value: function getRowHeaderWidth() {
      var rowHeadersWidthSetting = this.instance.getSetting('rowHeaderWidth');
      var rowHeaders = this.instance.getSetting('rowHeaders');

      if (rowHeadersWidthSetting) {
        this.rowHeaderWidth = 0;

        for (var i = 0, len = rowHeaders.length; i < len; i++) {
          this.rowHeaderWidth += rowHeadersWidthSetting[i] || rowHeadersWidthSetting;
        }
      }

      if (this.wot.cloneSource) {
        return this.wot.cloneSource.wtViewport.getRowHeaderWidth();
      }

      if (isNaN(this.rowHeaderWidth)) {
        if (rowHeaders.length) {
          var TH = this.instance.wtTable.TABLE.querySelector('TH');
          this.rowHeaderWidth = 0;

          for (var _i = 0, _len = rowHeaders.length; _i < _len; _i++) {
            if (TH) {
              this.rowHeaderWidth += outerWidth(TH);
              TH = TH.nextSibling;
            } else {
              // yes this is a cheat but it worked like that before, just taking assumption from CSS instead of measuring.
              // TODO: proper fix
              this.rowHeaderWidth += 50;
            }
          }
        } else {
          this.rowHeaderWidth = 0;
        }
      }

      this.rowHeaderWidth = this.instance.getSetting('onModifyRowHeaderWidth', this.rowHeaderWidth) || this.rowHeaderWidth;
      return this.rowHeaderWidth;
    }
    /**
     * @returns {Number}
     */

  }, {
    key: "getViewportWidth",
    value: function getViewportWidth() {
      var containerWidth = this.getWorkspaceWidth();

      if (containerWidth === Infinity) {
        return containerWidth;
      }

      var rowHeaderWidth = this.getRowHeaderWidth();

      if (rowHeaderWidth > 0) {
        return containerWidth - rowHeaderWidth;
      }

      return containerWidth;
    }
    /**
     * Creates:
     *  - rowsRenderCalculator (before draw, to qualify rows for rendering)
     *  - rowsVisibleCalculator (after draw, to measure which rows are actually visible)
     *
     * @returns {ViewportRowsCalculator}
     */

  }, {
    key: "createRowsCalculator",
    value: function createRowsCalculator() {
      var visible = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var wot = this.wot;
      var wtSettings = wot.wtSettings,
          wtOverlays = wot.wtOverlays,
          wtTable = wot.wtTable,
          rootDocument = wot.rootDocument;
      var height;
      var scrollbarHeight;
      var fixedRowsHeight;
      this.rowHeaderWidth = NaN;

      if (wtSettings.settings.renderAllRows && !visible) {
        height = Infinity;
      } else {
        height = this.getViewportHeight();
      }

      var pos = wtOverlays.topOverlay.getScrollPosition() - wtOverlays.topOverlay.getTableParentOffset();

      if (pos < 0) {
        pos = 0;
      }

      var fixedRowsTop = wot.getSetting('fixedRowsTop');
      var fixedRowsBottom = wot.getSetting('fixedRowsBottom');
      var totalRows = wot.getSetting('totalRows');

      if (fixedRowsTop) {
        fixedRowsHeight = wtOverlays.topOverlay.sumCellSizes(0, fixedRowsTop);
        pos += fixedRowsHeight;
        height -= fixedRowsHeight;
      }

      if (fixedRowsBottom && wtOverlays.bottomOverlay.clone) {
        fixedRowsHeight = wtOverlays.bottomOverlay.sumCellSizes(totalRows - fixedRowsBottom, totalRows);
        height -= fixedRowsHeight;
      }

      if (wtTable.holder.clientHeight === wtTable.holder.offsetHeight) {
        scrollbarHeight = 0;
      } else {
        scrollbarHeight = getScrollbarWidth(rootDocument);
      }

      return new ViewportRowsCalculator(height, pos, wot.getSetting('totalRows'), function (sourceRow) {
        return wtTable.getRowHeight(sourceRow);
      }, visible ? null : wtSettings.settings.viewportRowCalculatorOverride, visible, scrollbarHeight);
    }
    /**
     * Creates:
     *  - columnsRenderCalculator (before draw, to qualify columns for rendering)
     *  - columnsVisibleCalculator (after draw, to measure which columns are actually visible)
     *
     * @returns {ViewportRowsCalculator}
     */

  }, {
    key: "createColumnsCalculator",
    value: function createColumnsCalculator() {
      var visible = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var wot = this.wot;
      var wtSettings = wot.wtSettings,
          wtOverlays = wot.wtOverlays,
          wtTable = wot.wtTable,
          rootDocument = wot.rootDocument;
      var width = this.getViewportWidth();
      var pos = wtOverlays.leftOverlay.getScrollPosition() - wtOverlays.leftOverlay.getTableParentOffset();
      this.columnHeaderHeight = NaN;

      if (pos < 0) {
        pos = 0;
      }

      var fixedColumnsLeft = wot.getSetting('fixedColumnsLeft');

      if (fixedColumnsLeft) {
        var fixedColumnsWidth = wtOverlays.leftOverlay.sumCellSizes(0, fixedColumnsLeft);
        pos += fixedColumnsWidth;
        width -= fixedColumnsWidth;
      }

      if (wtTable.holder.clientWidth !== wtTable.holder.offsetWidth) {
        width -= getScrollbarWidth(rootDocument);
      }

      return new ViewportColumnsCalculator(width, pos, wot.getSetting('totalColumns'), function (sourceCol) {
        return wot.wtTable.getColumnWidth(sourceCol);
      }, visible ? null : wtSettings.settings.viewportColumnCalculatorOverride, visible, wot.getSetting('stretchH'), function (stretchedWidth, column) {
        return wot.getSetting('onBeforeStretchingColumnWidth', stretchedWidth, column);
      });
    }
    /**
     * Creates rowsRenderCalculator and columnsRenderCalculator (before draw, to determine what rows and
     * cols should be rendered)
     *
     * @param fastDraw {Boolean} If `true`, will try to avoid full redraw and only update the border positions.
     *                           If `false` or `undefined`, will perform a full redraw
     * @returns fastDraw {Boolean} The fastDraw value, possibly modified
     */

  }, {
    key: "createRenderCalculators",
    value: function createRenderCalculators() {
      var fastDraw = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var runFastDraw = fastDraw;

      if (runFastDraw) {
        var proposedRowsVisibleCalculator = this.createRowsCalculator(true);
        var proposedColumnsVisibleCalculator = this.createColumnsCalculator(true);

        if (!(this.areAllProposedVisibleRowsAlreadyRendered(proposedRowsVisibleCalculator) && this.areAllProposedVisibleColumnsAlreadyRendered(proposedColumnsVisibleCalculator))) {
          runFastDraw = false;
        }
      }

      if (!runFastDraw) {
        this.rowsRenderCalculator = this.createRowsCalculator();
        this.columnsRenderCalculator = this.createColumnsCalculator();
      } // delete temporarily to make sure that renderers always use rowsRenderCalculator, not rowsVisibleCalculator


      this.rowsVisibleCalculator = null;
      this.columnsVisibleCalculator = null;
      return runFastDraw;
    }
    /**
     * Creates rowsVisibleCalculator and columnsVisibleCalculator (after draw, to determine what are
     * the actually visible rows and columns)
     */

  }, {
    key: "createVisibleCalculators",
    value: function createVisibleCalculators() {
      this.rowsVisibleCalculator = this.createRowsCalculator(true);
      this.columnsVisibleCalculator = this.createColumnsCalculator(true);
    }
    /**
     * Returns information whether proposedRowsVisibleCalculator viewport
     * is contained inside rows rendered in previous draw (cached in rowsRenderCalculator)
     *
     * @param {Object} proposedRowsVisibleCalculator
     * @returns {Boolean} Returns `true` if all proposed visible rows are already rendered (meaning: redraw is not needed).
     *                    Returns `false` if at least one proposed visible row is not already rendered (meaning: redraw is needed)
     */

  }, {
    key: "areAllProposedVisibleRowsAlreadyRendered",
    value: function areAllProposedVisibleRowsAlreadyRendered(proposedRowsVisibleCalculator) {
      if (this.rowsVisibleCalculator) {
        if (proposedRowsVisibleCalculator.startRow < this.rowsRenderCalculator.startRow || proposedRowsVisibleCalculator.startRow === this.rowsRenderCalculator.startRow && proposedRowsVisibleCalculator.startRow > 0) {
          return false;
        } else if (proposedRowsVisibleCalculator.endRow > this.rowsRenderCalculator.endRow || proposedRowsVisibleCalculator.endRow === this.rowsRenderCalculator.endRow && proposedRowsVisibleCalculator.endRow < this.wot.getSetting('totalRows') - 1) {
          return false;
        }

        return true;
      }

      return false;
    }
    /**
     * Returns information whether proposedColumnsVisibleCalculator viewport
     * is contained inside column rendered in previous draw (cached in columnsRenderCalculator)
     *
     * @param {Object} proposedColumnsVisibleCalculator
     * @returns {Boolean} Returns `true` if all proposed visible columns are already rendered (meaning: redraw is not needed).
     *                    Returns `false` if at least one proposed visible column is not already rendered (meaning: redraw is needed)
     */

  }, {
    key: "areAllProposedVisibleColumnsAlreadyRendered",
    value: function areAllProposedVisibleColumnsAlreadyRendered(proposedColumnsVisibleCalculator) {
      if (this.columnsVisibleCalculator) {
        if (proposedColumnsVisibleCalculator.startColumn < this.columnsRenderCalculator.startColumn || proposedColumnsVisibleCalculator.startColumn === this.columnsRenderCalculator.startColumn && proposedColumnsVisibleCalculator.startColumn > 0) {
          return false;
        } else if (proposedColumnsVisibleCalculator.endColumn > this.columnsRenderCalculator.endColumn || proposedColumnsVisibleCalculator.endColumn === this.columnsRenderCalculator.endColumn && proposedColumnsVisibleCalculator.endColumn < this.wot.getSetting('totalColumns') - 1) {
          return false;
        }

        return true;
      }

      return false;
    }
    /**
     * Resets values in keys of the hasOversizedColumnHeadersMarked object after updateSettings.
     */

  }, {
    key: "resetHasOversizedColumnHeadersMarked",
    value: function resetHasOversizedColumnHeadersMarked() {
      objectEach(this.hasOversizedColumnHeadersMarked, function (value, key, object) {
        object[key] = void 0;
      });
    }
  }]);

  return Viewport;
}();

export default Viewport;