"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.symbol.iterator");

require("core-js/modules/es.array.includes");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.array.join");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.string.includes");

require("core-js/modules/es.string.iterator");

require("core-js/modules/web.dom-collections.iterator");

exports.__esModule = true;
exports.default = void 0;

var _element = require("./../../../helpers/dom/element");

var _event = require("./../../../helpers/dom/event");

var _object = require("./../../../helpers/object");

var _browser = require("./../../../helpers/browser");

var _eventManager = _interopRequireDefault(require("./../../../eventManager"));

var _coords = _interopRequireDefault(require("./cell/coords"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 *
 */
var Border =
/*#__PURE__*/
function () {
  /**
   * @param {Walkontable} wotInstance
   * @param {Object} settings
   */
  function Border(wotInstance, settings) {
    _classCallCheck(this, Border);

    if (!settings) {
      return;
    }

    this.eventManager = new _eventManager.default(wotInstance);
    this.instance = wotInstance;
    this.wot = wotInstance;
    this.settings = settings;
    this.mouseDown = false;
    this.main = null;
    this.top = null;
    this.left = null;
    this.bottom = null;
    this.right = null;
    this.topStyle = null;
    this.leftStyle = null;
    this.bottomStyle = null;
    this.rightStyle = null;
    this.cornerDefaultStyle = {
      width: '6px',
      height: '6px',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: '#FFF'
    };
    this.corner = null;
    this.cornerStyle = null;
    this.createBorders(settings);
    this.registerListeners();
  }
  /**
   * Register all necessary events
   */


  _createClass(Border, [{
    key: "registerListeners",
    value: function registerListeners() {
      var _this2 = this;

      var documentBody = this.wot.rootDocument.body;
      this.eventManager.addEventListener(documentBody, 'mousedown', function () {
        return _this2.onMouseDown();
      });
      this.eventManager.addEventListener(documentBody, 'mouseup', function () {
        return _this2.onMouseUp();
      });

      var _loop = function _loop(c, len) {
        _this2.eventManager.addEventListener(_this2.main.childNodes[c], 'mouseenter', function (event) {
          return _this2.onMouseEnter(event, _this2.main.childNodes[c]);
        });
      };

      for (var c = 0, len = this.main.childNodes.length; c < len; c++) {
        _loop(c, len);
      }
    }
    /**
     * Mouse down listener
     *
     * @private
     */

  }, {
    key: "onMouseDown",
    value: function onMouseDown() {
      this.mouseDown = true;
    }
    /**
     * Mouse up listener
     *
     * @private
     */

  }, {
    key: "onMouseUp",
    value: function onMouseUp() {
      this.mouseDown = false;
    }
    /**
     * Mouse enter listener for fragment selection functionality.
     *
     * @private
     * @param {Event} event Dom event
     * @param {HTMLElement} parentElement Part of border element.
     */

  }, {
    key: "onMouseEnter",
    value: function onMouseEnter(event, parentElement) {
      if (!this.mouseDown || !this.wot.getSetting('hideBorderOnMouseDownOver')) {
        return;
      }

      event.preventDefault();
      (0, _event.stopImmediatePropagation)(event);

      var _this = this;

      var documentBody = this.wot.rootDocument.body;
      var bounds = parentElement.getBoundingClientRect(); // Hide border to prevents selection jumping when fragmentSelection is enabled.

      parentElement.style.display = 'none';

      function isOutside(mouseEvent) {
        if (mouseEvent.clientY < Math.floor(bounds.top)) {
          return true;
        }

        if (mouseEvent.clientY > Math.ceil(bounds.top + bounds.height)) {
          return true;
        }

        if (mouseEvent.clientX < Math.floor(bounds.left)) {
          return true;
        }

        if (mouseEvent.clientX > Math.ceil(bounds.left + bounds.width)) {
          return true;
        }
      }

      function handler(handlerEvent) {
        if (isOutside(handlerEvent)) {
          _this.eventManager.removeEventListener(documentBody, 'mousemove', handler);

          parentElement.style.display = 'block';
        }
      }

      this.eventManager.addEventListener(documentBody, 'mousemove', handler);
    }
    /**
     * Create border elements
     *
     * @param {Object} settings
     */

  }, {
    key: "createBorders",
    value: function createBorders(settings) {
      var rootDocument = this.wot.rootDocument;
      this.main = rootDocument.createElement('div');
      var borderDivs = ['top', 'left', 'bottom', 'right', 'corner'];
      var style = this.main.style;
      style.position = 'absolute';
      style.top = 0;
      style.left = 0;

      for (var i = 0; i < 5; i++) {
        var position = borderDivs[i];
        var div = rootDocument.createElement('div');
        div.className = "wtBorder ".concat(this.settings.className || ''); // + borderDivs[i];

        if (this.settings[position] && this.settings[position].hide) {
          div.className += ' hidden';
        }

        style = div.style;
        style.backgroundColor = this.settings[position] && this.settings[position].color ? this.settings[position].color : settings.border.color;
        style.height = this.settings[position] && this.settings[position].width ? "".concat(this.settings[position].width, "px") : "".concat(settings.border.width, "px");
        style.width = this.settings[position] && this.settings[position].width ? "".concat(this.settings[position].width, "px") : "".concat(settings.border.width, "px");
        this.main.appendChild(div);
      }

      this.top = this.main.childNodes[0];
      this.left = this.main.childNodes[1];
      this.bottom = this.main.childNodes[2];
      this.right = this.main.childNodes[3];
      this.topStyle = this.top.style;
      this.leftStyle = this.left.style;
      this.bottomStyle = this.bottom.style;
      this.rightStyle = this.right.style;
      this.corner = this.main.childNodes[4];
      this.corner.className += ' corner';
      this.cornerStyle = this.corner.style;
      this.cornerStyle.width = this.cornerDefaultStyle.width;
      this.cornerStyle.height = this.cornerDefaultStyle.height;
      this.cornerStyle.border = [this.cornerDefaultStyle.borderWidth, this.cornerDefaultStyle.borderStyle, this.cornerDefaultStyle.borderColor].join(' ');

      if ((0, _browser.isMobileBrowser)()) {
        this.createMultipleSelectorHandles();
      }

      this.disappear();
      var wtTable = this.wot.wtTable;
      var bordersHolder = wtTable.bordersHolder;

      if (!bordersHolder) {
        bordersHolder = rootDocument.createElement('div');
        bordersHolder.className = 'htBorders';
        wtTable.bordersHolder = bordersHolder;
        wtTable.spreader.appendChild(bordersHolder);
      }

      bordersHolder.appendChild(this.main);
    }
    /**
     * Create multiple selector handler for mobile devices
     */

  }, {
    key: "createMultipleSelectorHandles",
    value: function createMultipleSelectorHandles() {
      var _this3 = this;

      var rootDocument = this.wot.rootDocument;
      this.selectionHandles = {
        topLeft: rootDocument.createElement('DIV'),
        topLeftHitArea: rootDocument.createElement('DIV'),
        bottomRight: rootDocument.createElement('DIV'),
        bottomRightHitArea: rootDocument.createElement('DIV')
      };
      var width = 10;
      var hitAreaWidth = 40;
      this.selectionHandles.topLeft.className = 'topLeftSelectionHandle';
      this.selectionHandles.topLeftHitArea.className = 'topLeftSelectionHandle-HitArea';
      this.selectionHandles.bottomRight.className = 'bottomRightSelectionHandle';
      this.selectionHandles.bottomRightHitArea.className = 'bottomRightSelectionHandle-HitArea';
      this.selectionHandles.styles = {
        topLeft: this.selectionHandles.topLeft.style,
        topLeftHitArea: this.selectionHandles.topLeftHitArea.style,
        bottomRight: this.selectionHandles.bottomRight.style,
        bottomRightHitArea: this.selectionHandles.bottomRightHitArea.style
      };
      var hitAreaStyle = {
        position: 'absolute',
        height: "".concat(hitAreaWidth, "px"),
        width: "".concat(hitAreaWidth, "px"),
        'border-radius': "".concat(parseInt(hitAreaWidth / 1.5, 10), "px")
      };
      (0, _object.objectEach)(hitAreaStyle, function (value, key) {
        _this3.selectionHandles.styles.bottomRightHitArea[key] = value;
        _this3.selectionHandles.styles.topLeftHitArea[key] = value;
      });
      var handleStyle = {
        position: 'absolute',
        height: "".concat(width, "px"),
        width: "".concat(width, "px"),
        'border-radius': "".concat(parseInt(width / 1.5, 10), "px"),
        background: '#F5F5FF',
        border: '1px solid #4285c8'
      };
      (0, _object.objectEach)(handleStyle, function (value, key) {
        _this3.selectionHandles.styles.bottomRight[key] = value;
        _this3.selectionHandles.styles.topLeft[key] = value;
      });
      this.main.appendChild(this.selectionHandles.topLeft);
      this.main.appendChild(this.selectionHandles.bottomRight);
      this.main.appendChild(this.selectionHandles.topLeftHitArea);
      this.main.appendChild(this.selectionHandles.bottomRightHitArea);
    }
  }, {
    key: "isPartRange",
    value: function isPartRange(row, col) {
      var areaSelection = this.wot.selections.createOrGetArea();

      if (areaSelection.cellRange) {
        if (row !== areaSelection.cellRange.to.row || col !== areaSelection.cellRange.to.col) {
          return true;
        }
      }

      return false;
    }
  }, {
    key: "updateMultipleSelectionHandlesPosition",
    value: function updateMultipleSelectionHandlesPosition(row, col, top, left, width, height) {
      var handleWidth = parseInt(this.selectionHandles.styles.topLeft.width, 10);
      var hitAreaWidth = parseInt(this.selectionHandles.styles.topLeftHitArea.width, 10);
      this.selectionHandles.styles.topLeft.top = "".concat(parseInt(top - handleWidth, 10), "px");
      this.selectionHandles.styles.topLeft.left = "".concat(parseInt(left - handleWidth, 10), "px");
      this.selectionHandles.styles.topLeftHitArea.top = "".concat(parseInt(top - hitAreaWidth / 4 * 3, 10), "px");
      this.selectionHandles.styles.topLeftHitArea.left = "".concat(parseInt(left - hitAreaWidth / 4 * 3, 10), "px");
      this.selectionHandles.styles.bottomRight.top = "".concat(parseInt(top + height, 10), "px");
      this.selectionHandles.styles.bottomRight.left = "".concat(parseInt(left + width, 10), "px");
      this.selectionHandles.styles.bottomRightHitArea.top = "".concat(parseInt(top + height - hitAreaWidth / 4, 10), "px");
      this.selectionHandles.styles.bottomRightHitArea.left = "".concat(parseInt(left + width - hitAreaWidth / 4, 10), "px");

      if (this.settings.border.cornerVisible && this.settings.border.cornerVisible()) {
        this.selectionHandles.styles.topLeft.display = 'block';
        this.selectionHandles.styles.topLeftHitArea.display = 'block';

        if (this.isPartRange(row, col)) {
          this.selectionHandles.styles.bottomRight.display = 'none';
          this.selectionHandles.styles.bottomRightHitArea.display = 'none';
        } else {
          this.selectionHandles.styles.bottomRight.display = 'block';
          this.selectionHandles.styles.bottomRightHitArea.display = 'block';
        }
      } else {
        this.selectionHandles.styles.topLeft.display = 'none';
        this.selectionHandles.styles.bottomRight.display = 'none';
        this.selectionHandles.styles.topLeftHitArea.display = 'none';
        this.selectionHandles.styles.bottomRightHitArea.display = 'none';
      }

      if (row === this.wot.wtSettings.getSetting('fixedRowsTop') || col === this.wot.wtSettings.getSetting('fixedColumnsLeft')) {
        this.selectionHandles.styles.topLeft.zIndex = '9999';
        this.selectionHandles.styles.topLeftHitArea.zIndex = '9999';
      } else {
        this.selectionHandles.styles.topLeft.zIndex = '';
        this.selectionHandles.styles.topLeftHitArea.zIndex = '';
      }
    }
    /**
     * Show border around one or many cells
     *
     * @param {Array} corners
     */

  }, {
    key: "appear",
    value: function appear(corners) {
      if (this.disabled) {
        return;
      }

      var _this$wot = this.wot,
          wtTable = _this$wot.wtTable,
          rootDocument = _this$wot.rootDocument,
          rootWindow = _this$wot.rootWindow;
      var fromRow;
      var toRow;
      var fromColumn;
      var toColumn;
      var rowsCount = wtTable.getRenderedRowsCount();

      for (var i = 0; i < rowsCount; i += 1) {
        var s = wtTable.rowFilter.renderedToSource(i);

        if (s >= corners[0] && s <= corners[2]) {
          fromRow = s;
          break;
        }
      }

      for (var _i = rowsCount - 1; _i >= 0; _i -= 1) {
        var _s = wtTable.rowFilter.renderedToSource(_i);

        if (_s >= corners[0] && _s <= corners[2]) {
          toRow = _s;
          break;
        }
      }

      var columnsCount = wtTable.getRenderedColumnsCount();

      for (var _i2 = 0; _i2 < columnsCount; _i2 += 1) {
        var _s2 = wtTable.columnFilter.renderedToSource(_i2);

        if (_s2 >= corners[1] && _s2 <= corners[3]) {
          fromColumn = _s2;
          break;
        }
      }

      for (var _i3 = columnsCount - 1; _i3 >= 0; _i3 -= 1) {
        var _s3 = wtTable.columnFilter.renderedToSource(_i3);

        if (_s3 >= corners[1] && _s3 <= corners[3]) {
          toColumn = _s3;
          break;
        }
      }

      if (fromRow === void 0 || fromColumn === void 0) {
        this.disappear();
        return;
      }

      var fromTD = wtTable.getCell(new _coords.default(fromRow, fromColumn));
      var isMultiple = fromRow !== toRow || fromColumn !== toColumn;
      var toTD = isMultiple ? wtTable.getCell(new _coords.default(toRow, toColumn)) : fromTD;
      var fromOffset = (0, _element.offset)(fromTD);
      var toOffset = isMultiple ? (0, _element.offset)(toTD) : fromOffset;
      var containerOffset = (0, _element.offset)(wtTable.TABLE);
      var minTop = fromOffset.top;
      var minLeft = fromOffset.left;
      var left = minLeft - containerOffset.left - 1;
      var width = toOffset.left + (0, _element.outerWidth)(toTD) - minLeft;

      if (this.isEntireColumnSelected(fromRow, toRow)) {
        var modifiedValues = this.getDimensionsFromHeader('columns', fromColumn, toColumn, containerOffset);
        var fromTH = null;

        if (modifiedValues) {
          var _modifiedValues = _slicedToArray(modifiedValues, 3);

          fromTH = _modifiedValues[0];
          left = _modifiedValues[1];
          width = _modifiedValues[2];
        }

        if (fromTH) {
          fromTD = fromTH;
        }
      }

      var top = minTop - containerOffset.top - 1;
      var height = toOffset.top + (0, _element.outerHeight)(toTD) - minTop;

      if (this.isEntireRowSelected(fromColumn, toColumn)) {
        var _modifiedValues2 = this.getDimensionsFromHeader('rows', fromRow, toRow, containerOffset);

        var _fromTH = null;

        if (_modifiedValues2) {
          var _modifiedValues3 = _slicedToArray(_modifiedValues2, 3);

          _fromTH = _modifiedValues3[0];
          top = _modifiedValues3[1];
          height = _modifiedValues3[2];
        }

        if (_fromTH) {
          fromTD = _fromTH;
        }
      }

      var style = (0, _element.getComputedStyle)(fromTD, rootWindow);

      if (parseInt(style.borderTopWidth, 10) > 0) {
        top += 1;
        height = height > 0 ? height - 1 : 0;
      }

      if (parseInt(style.borderLeftWidth, 10) > 0) {
        left += 1;
        width = width > 0 ? width - 1 : 0;
      }

      this.topStyle.top = "".concat(top, "px");
      this.topStyle.left = "".concat(left, "px");
      this.topStyle.width = "".concat(width, "px");
      this.topStyle.display = 'block';
      this.leftStyle.top = "".concat(top, "px");
      this.leftStyle.left = "".concat(left, "px");
      this.leftStyle.height = "".concat(height, "px");
      this.leftStyle.display = 'block';
      var delta = Math.floor(this.settings.border.width / 2);
      this.bottomStyle.top = "".concat(top + height - delta, "px");
      this.bottomStyle.left = "".concat(left, "px");
      this.bottomStyle.width = "".concat(width, "px");
      this.bottomStyle.display = 'block';
      this.rightStyle.top = "".concat(top, "px");
      this.rightStyle.left = "".concat(left + width - delta, "px");
      this.rightStyle.height = "".concat(height + 1, "px");
      this.rightStyle.display = 'block';
      var cornerVisibleSetting = this.settings.border.cornerVisible;
      cornerVisibleSetting = typeof cornerVisibleSetting === 'function' ? cornerVisibleSetting(this.settings.layerLevel) : cornerVisibleSetting;
      var hookResult = this.wot.getSetting('onModifyGetCellCoords', toRow, toColumn);
      var checkRow = toRow,
          checkCol = toColumn;

      if (hookResult && Array.isArray(hookResult)) {
        var _hookResult = _slicedToArray(hookResult, 4);

        checkRow = _hookResult[2];
        checkCol = _hookResult[3];
      }

      if ((0, _browser.isMobileBrowser)() || !cornerVisibleSetting || this.isPartRange(checkRow, checkCol)) {
        this.cornerStyle.display = 'none';
      } else {
        this.cornerStyle.top = "".concat(top + height - 4, "px");
        this.cornerStyle.left = "".concat(left + width - 4, "px");
        this.cornerStyle.borderRightWidth = this.cornerDefaultStyle.borderWidth;
        this.cornerStyle.width = this.cornerDefaultStyle.width; // Hide the fill handle, so the possible further adjustments won't force unneeded scrollbars.

        this.cornerStyle.display = 'none';
        var trimmingContainer = (0, _element.getTrimmingContainer)(wtTable.TABLE);
        var trimToWindow = trimmingContainer === rootWindow;

        if (trimToWindow) {
          trimmingContainer = rootDocument.documentElement;
        }

        if (toColumn === this.wot.getSetting('totalColumns') - 1) {
          var toTdOffsetLeft = trimToWindow ? toTD.getBoundingClientRect().left : toTD.offsetLeft;
          var cornerRightEdge = toTdOffsetLeft + (0, _element.outerWidth)(toTD) + parseInt(this.cornerDefaultStyle.width, 10) / 2;
          var cornerOverlappingContainer = cornerRightEdge >= (0, _element.innerWidth)(trimmingContainer);

          if (cornerOverlappingContainer) {
            this.cornerStyle.left = "".concat(Math.floor(left + width - 3 - parseInt(this.cornerDefaultStyle.width, 10) / 2), "px");
            this.cornerStyle.borderRightWidth = 0;
          }
        }

        if (toRow === this.wot.getSetting('totalRows') - 1) {
          var toTdOffsetTop = trimToWindow ? toTD.getBoundingClientRect().top : toTD.offsetTop;
          var cornerBottomEdge = toTdOffsetTop + (0, _element.outerHeight)(toTD) + parseInt(this.cornerDefaultStyle.height, 10) / 2;

          var _cornerOverlappingContainer = cornerBottomEdge >= (0, _element.innerHeight)(trimmingContainer);

          if (_cornerOverlappingContainer) {
            this.cornerStyle.top = "".concat(Math.floor(top + height - 3 - parseInt(this.cornerDefaultStyle.height, 10) / 2), "px");
            this.cornerStyle.borderBottomWidth = 0;
          }
        }

        this.cornerStyle.display = 'block';
      }

      if ((0, _browser.isMobileBrowser)()) {
        this.updateMultipleSelectionHandlesPosition(toRow, toColumn, top, left, width, height);
      }
    }
    /**
     * Check whether an entire column of cells is selected.
     *
     * @private
     * @param {Number} startRowIndex Start row index.
     * @param {Number} endRowIndex End row index.
     */

  }, {
    key: "isEntireColumnSelected",
    value: function isEntireColumnSelected(startRowIndex, endRowIndex) {
      return startRowIndex === this.wot.wtTable.getFirstRenderedRow() && endRowIndex === this.wot.wtTable.getLastRenderedRow();
    }
    /**
     * Check whether an entire row of cells is selected.
     *
     * @private
     * @param {Number} startColumnIndex Start column index.
     * @param {Number} endColumnIndex End column index.
     */

  }, {
    key: "isEntireRowSelected",
    value: function isEntireRowSelected(startColumnIndex, endColumnIndex) {
      return startColumnIndex === this.wot.wtTable.getFirstRenderedColumn() && endColumnIndex === this.wot.wtTable.getLastRenderedColumn();
    }
    /**
     * Get left/top index and width/height depending on the `direction` provided.
     *
     * @private
     * @param {String} direction `rows` or `columns`, defines if an entire column or row is selected.
     * @param {Number} fromIndex Start index of the selection.
     * @param {Number} toIndex End index of the selection.
     * @param {Number} containerOffset offset of the container.
     * @return {Array|Boolean} Returns an array of [headerElement, left, width] or [headerElement, top, height], depending on `direction` (`false` in case of an error getting the headers).
     */

  }, {
    key: "getDimensionsFromHeader",
    value: function getDimensionsFromHeader(direction, fromIndex, toIndex, containerOffset) {
      var wtTable = this.wot.wtTable;
      var rootHotElement = wtTable.wtRootElement.parentNode;
      var getHeaderFn = null;
      var dimensionFn = null;
      var entireSelectionClassname = null;
      var index = null;
      var dimension = null;
      var dimensionProperty = null;
      var startHeader = null;
      var endHeader = null;

      switch (direction) {
        case 'rows':
          getHeaderFn = function getHeaderFn() {
            return wtTable.getRowHeader.apply(wtTable, arguments);
          };

          dimensionFn = function dimensionFn() {
            return _element.outerHeight.apply(void 0, arguments);
          };

          entireSelectionClassname = 'ht__selection--rows';
          dimensionProperty = 'top';
          break;

        case 'columns':
          getHeaderFn = function getHeaderFn() {
            return wtTable.getColumnHeader.apply(wtTable, arguments);
          };

          dimensionFn = function dimensionFn() {
            return _element.outerWidth.apply(void 0, arguments);
          };

          entireSelectionClassname = 'ht__selection--columns';
          dimensionProperty = 'left';
          break;

        default:
      }

      if (rootHotElement.className.includes(entireSelectionClassname)) {
        var columnHeaderLevelCount = this.wot.getSetting('columnHeaders').length;
        startHeader = getHeaderFn(fromIndex, columnHeaderLevelCount - 1);
        endHeader = getHeaderFn(toIndex, columnHeaderLevelCount - 1);

        if (!startHeader || !endHeader) {
          return false;
        }

        var startHeaderOffset = (0, _element.offset)(startHeader);
        var endOffset = (0, _element.offset)(endHeader);

        if (startHeader && endHeader) {
          index = startHeaderOffset[dimensionProperty] - containerOffset[dimensionProperty] - 1;
          dimension = endOffset[dimensionProperty] + dimensionFn(endHeader) - startHeaderOffset[dimensionProperty];
        }

        return [startHeader, index, dimension];
      }

      return false;
    }
    /**
     * Change border style.
     *
     * @private
     * @param {String} borderElement Coordinate where add/remove border: top, right, bottom, left.
     */

  }, {
    key: "changeBorderStyle",
    value: function changeBorderStyle(borderElement, border) {
      var style = this[borderElement].style;
      var borderStyle = border[borderElement];

      if (!borderStyle || borderStyle.hide) {
        (0, _element.addClass)(this[borderElement], 'hidden');
      } else {
        if ((0, _element.hasClass)(this[borderElement], 'hidden')) {
          (0, _element.removeClass)(this[borderElement], 'hidden');
        }

        style.backgroundColor = borderStyle.color;

        if (borderElement === 'top' || borderElement === 'bottom') {
          style.height = "".concat(borderStyle.width, "px");
        }

        if (borderElement === 'right' || borderElement === 'left') {
          style.width = "".concat(borderStyle.width, "px");
        }
      }
    }
    /**
     * Change border style to default.
     *
     * @private
     * @param {HTMLElement} position
     */

  }, {
    key: "changeBorderToDefaultStyle",
    value: function changeBorderToDefaultStyle(position) {
      var defaultBorder = {
        width: 1,
        color: '#000'
      };
      var style = this[position].style;
      style.backgroundColor = defaultBorder.color;
      style.width = "".concat(defaultBorder.width, "px");
      style.height = "".concat(defaultBorder.width, "px");
    }
    /**
     * Toggle class 'hidden' to element.
     *
     * @private
     * @param {String} borderElement Coordinate where add/remove border: top, right, bottom, left.
     * @return {Boolean}
     */

  }, {
    key: "toggleHiddenClass",
    value: function toggleHiddenClass(borderElement, remove) {
      this.changeBorderToDefaultStyle(borderElement);

      if (remove) {
        (0, _element.addClass)(this[borderElement], 'hidden');
      } else {
        (0, _element.removeClass)(this[borderElement], 'hidden');
      }
    }
    /**
     * Hide border
     */

  }, {
    key: "disappear",
    value: function disappear() {
      this.topStyle.display = 'none';
      this.leftStyle.display = 'none';
      this.bottomStyle.display = 'none';
      this.rightStyle.display = 'none';
      this.cornerStyle.display = 'none';

      if ((0, _browser.isMobileBrowser)()) {
        this.selectionHandles.styles.topLeft.display = 'none';
        this.selectionHandles.styles.bottomRight.display = 'none';
      }
    }
  }]);

  return Border;
}();

var _default = Border;
exports.default = _default;