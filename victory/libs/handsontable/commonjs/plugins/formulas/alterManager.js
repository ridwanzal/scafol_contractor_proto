"use strict";

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.map");

require("core-js/modules/es.object.get-own-property-descriptor");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.string.iterator");

require("core-js/modules/web.dom-collections.iterator");

exports.__esModule = true;
exports.registerOperation = registerOperation;
exports.default = void 0;

var _object = require("../../helpers/object");

var _localHooks = _interopRequireDefault(require("../../mixins/localHooks"));

var columnSorting = _interopRequireWildcard(require("./alterOperation/columnSorting"));

var insertColumn = _interopRequireWildcard(require("./alterOperation/insertColumn"));

var insertRow = _interopRequireWildcard(require("./alterOperation/insertRow"));

var removeColumn = _interopRequireWildcard(require("./alterOperation/removeColumn"));

var removeRow = _interopRequireWildcard(require("./alterOperation/removeRow"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var operations = new Map();
registerOperation(columnSorting.OPERATION_NAME, columnSorting);
registerOperation(insertColumn.OPERATION_NAME, insertColumn);
registerOperation(insertRow.OPERATION_NAME, insertRow);
registerOperation(removeColumn.OPERATION_NAME, removeColumn);
registerOperation(removeRow.OPERATION_NAME, removeRow);
/**
 * Alter Manager is a service that is responsible for changing the formula expressions (especially cell coordinates)
 * based on specific alter operation applied into the table.
 *
 * For example, when a user adds a new row the algorithm that moves all the cells below the added row down by one row
 * should be triggered (eq: cell A5 become A6 etc).
 *
 * All alter operations are defined in the "alterOperation/" directory.
 *
 * @class AlterManager
 * @util
 */

var AlterManager =
/*#__PURE__*/
function () {
  function AlterManager(sheet) {
    _classCallCheck(this, AlterManager);

    /**
     * Instance of {@link Sheet}.
     *
     * @type {Sheet}
     */
    this.sheet = sheet;
    /**
     * Handsontable instance.
     *
     * @type {Core}
     */

    this.hot = sheet.hot;
    /**
     * Instance of {@link DataProvider}.
     *
     * @type {DataProvider}
     */

    this.dataProvider = sheet.dataProvider;
    /**
     * Instance of {@link Matrix}.
     *
     * @type {Matrix}
     */

    this.matrix = sheet.matrix;
  }
  /**
   * Prepare to execute an alter algorithm. This preparation can be useful for collecting some variables and
   * states before specific algorithm will be executed.
   *
   * @param  {String} action One of the action defined in alterOperation.
   * @param  {*} args Arguments pass to alter operation.
   */


  _createClass(AlterManager, [{
    key: "prepareAlter",
    value: function prepareAlter(action) {
      if (!operations.has(action)) {
        throw Error("Alter operation \"".concat(action, "\" not exist."));
      }

      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      operations.get(action).prepare.apply(this, args);
    }
    /**
     * Trigger an alter algorithm and after executing code trigger local hook ("afterAlter").
     *
     * @param {String} action One of the action defined in alterOperation.
     * @param {*} args Arguments pass to alter operation.
     */

  }, {
    key: "triggerAlter",
    value: function triggerAlter(action) {
      if (!operations.has(action)) {
        throw Error("Alter operation \"".concat(action, "\" not exist."));
      }

      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      operations.get(action).operate.apply(this, args);
      this.runLocalHooks.apply(this, ['afterAlter'].concat(args));
    }
    /**
     * Destroy class.
     */

  }, {
    key: "destroy",
    value: function destroy() {
      this.sheet = null;
      this.hot = null;
      this.dataProvider = null;
      this.matrix = null;
    }
  }]);

  return AlterManager;
}();

(0, _object.mixin)(AlterManager, _localHooks.default);
var _default = AlterManager;
exports.default = _default;

var empty = function empty() {};

function registerOperation(name, descriptor) {
  if (!operations.has(name)) {
    operations.set(name, {
      prepare: descriptor.prepare || empty,
      operate: descriptor.operate || empty
    });
  }
}