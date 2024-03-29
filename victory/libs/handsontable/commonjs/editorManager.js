"use strict";

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.string.iterator");

require("core-js/modules/es.weak-map");

require("core-js/modules/web.dom-collections.iterator");

exports.__esModule = true;
exports.default = void 0;

var _src = require("./3rdparty/walkontable/src");

var _unicode = require("./helpers/unicode");

var _event = require("./helpers/dom/event");

var _editors = require("./editors");

var _eventManager = _interopRequireDefault(require("./eventManager"));

var _baseEditor = require("./editors/_baseEditor");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var EditorManager =
/*#__PURE__*/
function () {
  /**
   * @param {Handsontable} instance
   * @param {GridSettings} priv
   * @param {Selection} selection
   */
  function EditorManager(instance, priv, selection) {
    var _this = this;

    _classCallCheck(this, EditorManager);

    /**
     * Instance of {@link Handsontable}
     *
     * @private
     * @type {Handsontable}
     */
    this.instance = instance;
    /**
     * Reference to an instance's private GridSettings object.
     *
     * @private
     * @type {GridSettings}
     */

    this.priv = priv;
    /**
     * Instance of {@link Selection}
     *
     * @private
     * @type {Selection}
     */

    this.selection = selection;
    /**
     * Instance of {@link EventManager}.
     *
     * @private
     * @type {EventManager}
     */

    this.eventManager = new _eventManager.default(instance);
    /**
     * Determines if EditorManager is destroyed.
     *
     * @private
     * @type {Boolean}
     */

    this.destroyed = false;
    /**
     * Determines if EditorManager is locked.
     *
     * @private
     * @type {Boolean}
     */

    this.lock = false;
    /**
     * A reference to an instance of the activeEditor.
     *
     * @private
     * @type {*}
     */

    this.activeEditor = void 0;
    this.instance.addHook('afterDocumentKeyDown', function (event) {
      return _this.onAfterDocumentKeyDown(event);
    });
    this.eventManager.addEventListener(this.instance.rootDocument.documentElement, 'keydown', function (event) {
      if (!_this.destroyed) {
        _this.instance.runHooks('afterDocumentKeyDown', event);
      }
    }); // Open editor when text composition is started (IME editor)

    this.eventManager.addEventListener(this.instance.rootDocument.documentElement, 'compositionstart', function (event) {
      if (!_this.destroyed && _this.activeEditor && !_this.activeEditor.isOpened() && _this.instance.isListening()) {
        _this.openEditor('', event);
      }
    });
    this.instance.view.wt.update('onCellDblClick', function (event, coords, elem) {
      return _this.onCellDblClick(event, coords, elem);
    });
  }
  /**
   * Lock the editor from being prepared and closed. Locking the editor prevents its closing and
   * reinitialized after selecting the new cell. This feature is necessary for a mobile editor.
   */


  _createClass(EditorManager, [{
    key: "lockEditor",
    value: function lockEditor() {
      this.lock = true;
    }
    /**
     * Unlock the editor from being prepared and closed. This method restores the original behavior of
     * the editors where for every new selection its instances are closed.
     */

  }, {
    key: "unlockEditor",
    value: function unlockEditor() {
      this.lock = false;
    }
    /**
     * Destroy current editor, if exists.
     *
     * @param {Boolean} revertOriginal
     */

  }, {
    key: "destroyEditor",
    value: function destroyEditor(revertOriginal) {
      if (!this.lock) {
        this.closeEditor(revertOriginal);
      }
    }
    /**
     * Get active editor.
     *
     * @returns {*}
     */

  }, {
    key: "getActiveEditor",
    value: function getActiveEditor() {
      return this.activeEditor;
    }
    /**
     * Prepare text input to be displayed at given grid cell.
     */

  }, {
    key: "prepareEditor",
    value: function prepareEditor() {
      var _this2 = this;

      if (this.lock) {
        return;
      }

      if (this.activeEditor && this.activeEditor.isWaiting()) {
        this.closeEditor(false, false, function (dataSaved) {
          if (dataSaved) {
            _this2.prepareEditor();
          }
        });
        return;
      }

      var _this$instance$select = this.instance.selection.selectedRange.current().highlight,
          row = _this$instance$select.row,
          col = _this$instance$select.col;
      var prop = this.instance.colToProp(col);
      var td = this.instance.getCell(row, col);
      var originalValue = this.instance.getSourceDataAtCell(this.instance.runHooks('modifyRow', row), col);
      var cellProperties = this.instance.getCellMeta(row, col);
      var editorClass = this.instance.getCellEditor(cellProperties);

      if (editorClass) {
        this.activeEditor = (0, _editors.getEditorInstance)(editorClass, this.instance);
        this.activeEditor.prepare(row, col, prop, td, originalValue, cellProperties);
      } else {
        this.activeEditor = void 0;
      }
    }
    /**
     * Check is editor is opened/showed.
     *
     * @returns {Boolean}
     */

  }, {
    key: "isEditorOpened",
    value: function isEditorOpened() {
      return this.activeEditor && this.activeEditor.isOpened();
    }
    /**
     * Open editor with initial value.
     *
     * @param {null|String} newInitialValue new value from which editor will start if handled property it's not the `null`.
     * @param {Event} event
     */

  }, {
    key: "openEditor",
    value: function openEditor(newInitialValue, event) {
      if (!this.activeEditor) {
        return;
      }

      var readOnly = this.activeEditor.cellProperties.readOnly;

      if (readOnly) {
        // move the selection after opening the editor with ENTER key
        if (event && event.keyCode === _unicode.KEY_CODES.ENTER) {
          this.moveSelectionAfterEnter();
        }
      } else {
        this.activeEditor.beginEditing(newInitialValue, event);
      }
    }
    /**
     * Close editor, finish editing cell.
     *
     * @param {Boolean} restoreOriginalValue
     * @param {Boolean} [isCtrlPressed]
     * @param {Function} [callback]
     */

  }, {
    key: "closeEditor",
    value: function closeEditor(restoreOriginalValue, isCtrlPressed, callback) {
      if (this.activeEditor) {
        this.activeEditor.finishEditing(restoreOriginalValue, isCtrlPressed, callback);
      } else if (callback) {
        callback(false);
      }
    }
    /**
     * Close editor and save changes.
     *
     * @param {Boolean} isCtrlPressed
     */

  }, {
    key: "closeEditorAndSaveChanges",
    value: function closeEditorAndSaveChanges(isCtrlPressed) {
      this.closeEditor(false, isCtrlPressed);
    }
    /**
     * Close editor and restore original value.
     *
     * @param {Boolean} isCtrlPressed
     */

  }, {
    key: "closeEditorAndRestoreOriginalValue",
    value: function closeEditorAndRestoreOriginalValue(isCtrlPressed) {
      return this.closeEditor(true, isCtrlPressed);
    }
    /**
     * Controls selection's behaviour after clicking `Enter`.
     *
     * @private
     * @param {Boolean} isShiftPressed
     */

  }, {
    key: "moveSelectionAfterEnter",
    value: function moveSelectionAfterEnter(isShiftPressed) {
      var enterMoves = typeof this.priv.settings.enterMoves === 'function' ? this.priv.settings.enterMoves(event) : this.priv.settings.enterMoves;

      if (isShiftPressed) {
        // move selection up
        this.selection.transformStart(-enterMoves.row, -enterMoves.col);
      } else {
        // move selection down (add a new row if needed)
        this.selection.transformStart(enterMoves.row, enterMoves.col, true);
      }
    }
    /**
     * Controls selection behaviour after clicking `arrow up`.
     *
     * @private
     * @param {Boolean} isShiftPressed
     */

  }, {
    key: "moveSelectionUp",
    value: function moveSelectionUp(isShiftPressed) {
      if (isShiftPressed) {
        this.selection.transformEnd(-1, 0);
      } else {
        this.selection.transformStart(-1, 0);
      }
    }
    /**
     * Controls selection's behaviour after clicking `arrow down`.
     *
     * @private
     * @param {Boolean} isShiftPressed
     */

  }, {
    key: "moveSelectionDown",
    value: function moveSelectionDown(isShiftPressed) {
      if (isShiftPressed) {
        // expanding selection down with shift
        this.selection.transformEnd(1, 0);
      } else {
        this.selection.transformStart(1, 0);
      }
    }
    /**
     * Controls selection's behaviour after clicking `arrow right`.
     *
     * @private
     * @param {Boolean} isShiftPressed
     */

  }, {
    key: "moveSelectionRight",
    value: function moveSelectionRight(isShiftPressed) {
      if (isShiftPressed) {
        this.selection.transformEnd(0, 1);
      } else {
        this.selection.transformStart(0, 1);
      }
    }
    /**
     * Controls selection's behaviour after clicking `arrow left`.
     *
     * @private
     * @param {Boolean} isShiftPressed
     */

  }, {
    key: "moveSelectionLeft",
    value: function moveSelectionLeft(isShiftPressed) {
      if (isShiftPressed) {
        this.selection.transformEnd(0, -1);
      } else {
        this.selection.transformStart(0, -1);
      }
    }
    /**
     * onAfterDocumentKeyDown callback.
     *
     * @private
     * @param {KeyboardEvent} event
     */

  }, {
    key: "onAfterDocumentKeyDown",
    value: function onAfterDocumentKeyDown(event) {
      if (!this.instance.isListening()) {
        return;
      }

      this.instance.runHooks('beforeKeyDown', event); // keyCode 229 aka 'uninitialized' doesn't take into account with editors. This key code is produced when unfinished
      // character is entering (using IME editor). It is fired mainly on linux (ubuntu) with installed ibus-pinyin package.

      if (this.destroyed || event.keyCode === 229) {
        return;
      }

      if ((0, _event.isImmediatePropagationStopped)(event)) {
        return;
      }

      this.priv.lastKeyCode = event.keyCode;

      if (!this.selection.isSelected()) {
        return;
      } // catch CTRL but not right ALT (which in some systems triggers ALT+CTRL)


      var isCtrlPressed = (event.ctrlKey || event.metaKey) && !event.altKey;

      if (this.activeEditor && !this.activeEditor.isWaiting()) {
        if (!(0, _unicode.isMetaKey)(event.keyCode) && !(0, _unicode.isCtrlMetaKey)(event.keyCode) && !isCtrlPressed && !this.isEditorOpened()) {
          this.openEditor('', event);
          return;
        }
      }

      var isShiftPressed = event.shiftKey;
      var rangeModifier = isShiftPressed ? this.selection.setRangeEnd : this.selection.setRangeStart;
      var tabMoves;

      switch (event.keyCode) {
        case _unicode.KEY_CODES.A:
          if (!this.isEditorOpened() && isCtrlPressed) {
            this.instance.selectAll();
            event.preventDefault();
            (0, _event.stopPropagation)(event);
          }

          break;

        case _unicode.KEY_CODES.ARROW_UP:
          if (this.isEditorOpened() && !this.activeEditor.isWaiting()) {
            this.closeEditorAndSaveChanges(isCtrlPressed);
          }

          this.moveSelectionUp(isShiftPressed);
          event.preventDefault();
          (0, _event.stopPropagation)(event);
          break;

        case _unicode.KEY_CODES.ARROW_DOWN:
          if (this.isEditorOpened() && !this.activeEditor.isWaiting()) {
            this.closeEditorAndSaveChanges(isCtrlPressed);
          }

          this.moveSelectionDown(isShiftPressed);
          event.preventDefault();
          (0, _event.stopPropagation)(event);
          break;

        case _unicode.KEY_CODES.ARROW_RIGHT:
          if (this.isEditorOpened() && !this.activeEditor.isWaiting()) {
            this.closeEditorAndSaveChanges(isCtrlPressed);
          }

          this.moveSelectionRight(isShiftPressed);
          event.preventDefault();
          (0, _event.stopPropagation)(event);
          break;

        case _unicode.KEY_CODES.ARROW_LEFT:
          if (this.isEditorOpened() && !this.activeEditor.isWaiting()) {
            this.closeEditorAndSaveChanges(isCtrlPressed);
          }

          this.moveSelectionLeft(isShiftPressed);
          event.preventDefault();
          (0, _event.stopPropagation)(event);
          break;

        case _unicode.KEY_CODES.TAB:
          tabMoves = typeof this.priv.settings.tabMoves === 'function' ? this.priv.settings.tabMoves(event) : this.priv.settings.tabMoves;

          if (isShiftPressed) {
            // move selection left
            this.selection.transformStart(-tabMoves.row, -tabMoves.col);
          } else {
            // move selection right (add a new column if needed)
            this.selection.transformStart(tabMoves.row, tabMoves.col, true);
          }

          event.preventDefault();
          (0, _event.stopPropagation)(event);
          break;

        case _unicode.KEY_CODES.BACKSPACE:
        case _unicode.KEY_CODES.DELETE:
          this.instance.emptySelectedCells();
          this.prepareEditor();
          event.preventDefault();
          break;

        case _unicode.KEY_CODES.F2:
          /* F2 */
          if (this.activeEditor) {
            this.activeEditor.enableFullEditMode();
          }

          this.openEditor(null, event);
          event.preventDefault(); // prevent Opera from opening 'Go to Page dialog'

          break;

        case _unicode.KEY_CODES.ENTER:
          /* return/enter */
          if (this.isEditorOpened()) {
            if (this.activeEditor && this.activeEditor.state !== _baseEditor.EditorState.WAITING) {
              this.closeEditorAndSaveChanges(isCtrlPressed);
            }

            this.moveSelectionAfterEnter(isShiftPressed);
          } else if (this.instance.getSettings().enterBeginsEditing) {
            if (this.activeEditor) {
              this.activeEditor.enableFullEditMode();
            }

            this.openEditor(null, event);
          } else {
            this.moveSelectionAfterEnter(isShiftPressed);
          }

          event.preventDefault(); // don't add newline to field

          (0, _event.stopImmediatePropagation)(event); // required by HandsontableEditor

          break;

        case _unicode.KEY_CODES.ESCAPE:
          if (this.isEditorOpened()) {
            this.closeEditorAndRestoreOriginalValue(isCtrlPressed);
            this.activeEditor.focus();
          }

          event.preventDefault();
          break;

        case _unicode.KEY_CODES.HOME:
          if (event.ctrlKey || event.metaKey) {
            rangeModifier.call(this.selection, new _src.CellCoords(0, this.selection.selectedRange.current().from.col));
          } else {
            rangeModifier.call(this.selection, new _src.CellCoords(this.selection.selectedRange.current().from.row, 0));
          }

          event.preventDefault(); // don't scroll the window

          (0, _event.stopPropagation)(event);
          break;

        case _unicode.KEY_CODES.END:
          if (event.ctrlKey || event.metaKey) {
            rangeModifier.call(this.selection, new _src.CellCoords(this.instance.countRows() - 1, this.selection.selectedRange.current().from.col));
          } else {
            rangeModifier.call(this.selection, new _src.CellCoords(this.selection.selectedRange.current().from.row, this.instance.countCols() - 1));
          }

          event.preventDefault(); // don't scroll the window

          (0, _event.stopPropagation)(event);
          break;

        case _unicode.KEY_CODES.PAGE_UP:
          this.selection.transformStart(-this.instance.countVisibleRows(), 0);
          event.preventDefault(); // don't page up the window

          (0, _event.stopPropagation)(event);
          break;

        case _unicode.KEY_CODES.PAGE_DOWN:
          this.selection.transformStart(this.instance.countVisibleRows(), 0);
          event.preventDefault(); // don't page down the window

          (0, _event.stopPropagation)(event);
          break;

        default:
          break;
      }
    }
    /**
     * onCellDblClick callback.
     *
     * @private
     * @param {MouseEvent} event
     * @param {Object} coords
     * @param {HTMLTableCellElement|HTMLTableHeaderCellElement} elem
     */

  }, {
    key: "onCellDblClick",
    value: function onCellDblClick(event, coords, elem) {
      // may be TD or TH
      if (elem.nodeName === 'TD') {
        if (this.activeEditor) {
          this.activeEditor.enableFullEditMode();
        }

        this.openEditor(null, event);
      }
    }
    /**
     * Destroy the instance.
     */

  }, {
    key: "destroy",
    value: function destroy() {
      this.destroyed = true;
      this.eventManager.destroy();
    }
  }]);

  return EditorManager;
}();

var instances = new WeakMap();
/**
 * @param {Handsontable} hotInstance
 * @param {GridSettings} hotSettings
 * @param {Selection} selection
 * @param {DataMap} datamap
 */

EditorManager.getInstance = function (hotInstance, hotSettings, selection, datamap) {
  var editorManager = instances.get(hotInstance);

  if (!editorManager) {
    editorManager = new EditorManager(hotInstance, hotSettings, selection, datamap);
    instances.set(hotInstance, editorManager);
  }

  return editorManager;
};

var _default = EditorManager;
exports.default = _default;