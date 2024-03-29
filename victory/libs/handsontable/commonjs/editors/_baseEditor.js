"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.symbol.iterator");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.object.get-prototype-of");

require("core-js/modules/es.object.set-prototype-of");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.string.iterator");

require("core-js/modules/es.string.trim");

require("core-js/modules/web.dom-collections.iterator");

exports.__esModule = true;
exports.default = exports.EditorState = void 0;

var _src = require("./../3rdparty/walkontable/src");

var _mixed = require("./../helpers/mixed");

var _object = require("./../helpers/object");

var _hooksRefRegisterer = _interopRequireDefault(require("./../mixins/hooksRefRegisterer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var EditorState = {
  VIRGIN: 'STATE_VIRGIN',
  // before editing
  EDITING: 'STATE_EDITING',
  WAITING: 'STATE_WAITING',
  // waiting for async validation
  FINISHED: 'STATE_FINISHED'
};
/**
 * @util
 * @class BaseEditor
 */

exports.EditorState = EditorState;

var BaseEditor =
/*#__PURE__*/
function () {
  function BaseEditor(instance) {
    _classCallCheck(this, BaseEditor);

    /**
     * A reference to the source instance of the Handsontable.
     *
     * @type {Handsontable}
     */
    this.hot = instance;
    /**
     * A reference to the source instance of the Handsontable.
     * @deprecated
     *
     * @type {Handsontable}
     */

    this.instance = instance;
    /**
     * Editor's state.
     *
     * @type {String}
     */

    this.state = EditorState.VIRGIN;
    /**
     * Flag to store information about editor's opening status.
     * @private
     *
     * @type {Boolean}
     */

    this._opened = false;
    /**
     * Defines the editor's editing mode. When false, then an editor works in fast editing mode.
     * @private
     *
     * @type {Boolean}
     */

    this._fullEditMode = false;
    /**
     * Callback to call after closing editor.
     *
     * @type {Function}
     */

    this._closeCallback = null;
    /**
     * Currently rendered cell's TD element.
     *
     * @type {HTMLTableCellElement}
     */

    this.TD = null;
    /**
     * Visual row index.
     *
     * @type {Number}
     */

    this.row = null;
    /**
     * Visual column index.
     *
     * @type {Number}
     */

    this.col = null;
    /**
     * Column property name or a column index, if datasource is an array of arrays.
     *
     * @type {Number|String}
     */

    this.prop = null;
    /**
     * Original cell's value.
     *
     * @type {*}
     */

    this.originalValue = null;
    /**
     * Object containing the cell's properties.
     *
     * @type {Object}
     */

    this.cellProperties = null;
    this.init();
  }
  /**
   * Fires callback after closing editor.
   *
   * @private
   * @param {Boolean} result
   */


  _createClass(BaseEditor, [{
    key: "_fireCallbacks",
    value: function _fireCallbacks(result) {
      if (this._closeCallback) {
        this._closeCallback(result);

        this._closeCallback = null;
      }
    }
    /**
     * Initializes an editor's intance.
     */

  }, {
    key: "init",
    value: function init() {}
    /**
     * Required method to get current value from editable element.
     */

  }, {
    key: "getValue",
    value: function getValue() {
      throw Error('Editor getValue() method unimplemented');
    }
    /**
     * Required method to set new value into editable element.
     */

  }, {
    key: "setValue",
    value: function setValue() {
      throw Error('Editor setValue() method unimplemented');
    }
    /**
     * Required method to open editor.
     */

  }, {
    key: "open",
    value: function open() {
      throw Error('Editor open() method unimplemented');
    }
    /**
     * Required method to close editor.
     */

  }, {
    key: "close",
    value: function close() {
      throw Error('Editor close() method unimplemented');
    }
    /**
     * Prepares editor's meta data.
     *
     * @param {Number} row
     * @param {Number} col
     * @param {Number|String} prop
     * @param {HTMLTableCellElement} td
     * @param {*} originalValue
     * @param {Object} cellProperties
     */

  }, {
    key: "prepare",
    value: function prepare(row, col, prop, td, originalValue, cellProperties) {
      this.TD = td;
      this.row = row;
      this.col = col;
      this.prop = prop;
      this.originalValue = originalValue;
      this.cellProperties = cellProperties;
      this.state = EditorState.VIRGIN;
    }
    /**
     * Fallback method to provide extendable editors in ES5.
     */

  }, {
    key: "extend",
    value: function extend() {
      return (
        /*#__PURE__*/
        function (_this$constructor) {
          _inherits(Editor, _this$constructor);

          function Editor() {
            _classCallCheck(this, Editor);

            return _possibleConstructorReturn(this, _getPrototypeOf(Editor).apply(this, arguments));
          }

          return Editor;
        }(this.constructor)
      );
    }
    /**
     * Saves value from editor into data storage.
     *
     * @param {*} value
     * @param {Boolean} ctrlDown If true, applies value to each cell in the last selected range.
     */

  }, {
    key: "saveValue",
    value: function saveValue(value, ctrlDown) {
      var selection;
      var tmp; // if ctrl+enter and multiple cells selected, behave like Excel (finish editing and apply to all cells)

      if (ctrlDown) {
        selection = this.hot.getSelectedLast();

        if (selection[0] > selection[2]) {
          tmp = selection[0];
          selection[0] = selection[2];
          selection[2] = tmp;
        }

        if (selection[1] > selection[3]) {
          tmp = selection[1];
          selection[1] = selection[3];
          selection[3] = tmp;
        }
      } else {
        selection = [this.row, this.col, null, null];
      }

      this.hot.populateFromArray(selection[0], selection[1], value, selection[2], selection[3], 'edit');
    }
    /**
     * Begins editing on a highlighted cell and hides fillHandle corner if was present.
     *
     * @param {*} newInitialValue
     * @param {*} event
     */

  }, {
    key: "beginEditing",
    value: function beginEditing(newInitialValue, event) {
      if (this.state !== EditorState.VIRGIN) {
        return;
      }

      this.hot.view.scrollViewport(new _src.CellCoords(this.row, this.col));
      this.state = EditorState.EDITING; // Set the editor value only in the full edit mode. In other mode the focusable element has to be empty,
      // otherwise IME (editor for Asia users) doesn't work.

      if (this.isInFullEditMode()) {
        var stringifiedInitialValue = typeof newInitialValue === 'string' ? newInitialValue : (0, _mixed.stringify)(this.originalValue);
        this.setValue(stringifiedInitialValue);
      }

      this.open(event);
      this._opened = true;
      this.focus(); // only rerender the selections (FillHandle should disappear when beginediting is triggered)

      this.hot.view.render();
      this.hot.runHooks('afterBeginEditing', this.row, this.col);
    }
    /**
     * Finishes editing and start saving or restoring process for editing cell or last selected range.
     *
     * @param {Boolean} restoreOriginalValue If true, then closes editor without saving value from the editor into a cell.
     * @param {Boolean} ctrlDown If true, then saveValue will save editor's value to each cell in the last selected range.
     * @param {Function} callback
     */

  }, {
    key: "finishEditing",
    value: function finishEditing(restoreOriginalValue, ctrlDown, callback) {
      var _this = this;

      var val;

      if (callback) {
        var previousCloseCallback = this._closeCallback;

        this._closeCallback = function (result) {
          if (previousCloseCallback) {
            previousCloseCallback(result);
          }

          callback(result);

          _this.hot.view.render();
        };
      }

      if (this.isWaiting()) {
        return;
      }

      if (this.state === EditorState.VIRGIN) {
        this.hot._registerTimeout(function () {
          _this._fireCallbacks(true);
        });

        return;
      }

      if (this.state === EditorState.EDITING) {
        if (restoreOriginalValue) {
          this.cancelChanges();
          this.hot.view.render();
          return;
        }

        var value = this.getValue();

        if (this.hot.getSettings().trimWhitespace) {
          // We trim only string values
          val = [[typeof value === 'string' ? String.prototype.trim.call(value || '') : value]];
        } else {
          val = [[value]];
        }

        this.state = EditorState.WAITING;
        this.saveValue(val, ctrlDown);

        if (this.hot.getCellValidator(this.cellProperties)) {
          this.hot.addHookOnce('postAfterValidate', function (result) {
            _this.state = EditorState.FINISHED;

            _this.discardEditor(result);
          });
        } else {
          this.state = EditorState.FINISHED;
          this.discardEditor(true);
        }
      }
    }
    /**
     * Finishes editing without singout saving value.
     */

  }, {
    key: "cancelChanges",
    value: function cancelChanges() {
      this.state = EditorState.FINISHED;
      this.discardEditor();
    }
    /**
     * Verifies result of validation or closes editor if user's cancelled changes.
     *
     * @param {Boolean|undefined} result
     */

  }, {
    key: "discardEditor",
    value: function discardEditor(result) {
      if (this.state !== EditorState.FINISHED) {
        return;
      } // validator was defined and failed


      if (result === false && this.cellProperties.allowInvalid !== true) {
        this.hot.selectCell(this.row, this.col);
        this.focus();
        this.state = EditorState.EDITING;

        this._fireCallbacks(false);
      } else {
        this.close();
        this._opened = false;
        this._fullEditMode = false;
        this.state = EditorState.VIRGIN;

        this._fireCallbacks(true);
      }
    }
    /**
     * Switch editor into full edit mode. In this state navigation keys don't close editor. This mode is activated
     * automatically after hit ENTER or F2 key on the cell or while editing cell press F2 key.
     */

  }, {
    key: "enableFullEditMode",
    value: function enableFullEditMode() {
      this._fullEditMode = true;
    }
    /**
     * Checks if editor is in full edit mode.
     *
     * @returns {Boolean}
     */

  }, {
    key: "isInFullEditMode",
    value: function isInFullEditMode() {
      return this._fullEditMode;
    }
    /**
     * Returns information whether the editor is open.
     */

  }, {
    key: "isOpened",
    value: function isOpened() {
      return this._opened;
    }
    /**
     * Returns information whether the editor is waiting, eg.: for async validation.
     */

  }, {
    key: "isWaiting",
    value: function isWaiting() {
      return this.state === EditorState.WAITING;
    }
    /**
     * Returns name of the overlay, where editor is placed.
     *
     * @private
     */

  }, {
    key: "checkEditorSection",
    value: function checkEditorSection() {
      var totalRows = this.hot.countRows();
      var section = '';

      if (this.row < this.hot.getSettings().fixedRowsTop) {
        if (this.col < this.hot.getSettings().fixedColumnsLeft) {
          section = 'top-left-corner';
        } else {
          section = 'top';
        }
      } else if (this.hot.getSettings().fixedRowsBottom && this.row >= totalRows - this.hot.getSettings().fixedRowsBottom) {
        if (this.col < this.hot.getSettings().fixedColumnsLeft) {
          section = 'bottom-left-corner';
        } else {
          section = 'bottom';
        }
      } else if (this.col < this.hot.getSettings().fixedColumnsLeft) {
        section = 'left';
      }

      return section;
    }
  }]);

  return BaseEditor;
}();

(0, _object.mixin)(BaseEditor, _hooksRefRegisterer.default);
var _default = BaseEditor;
exports.default = _default;