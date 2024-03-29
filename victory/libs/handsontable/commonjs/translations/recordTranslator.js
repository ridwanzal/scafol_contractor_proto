"use strict";

exports.__esModule = true;
exports.registerIdentity = registerIdentity;
exports.getTranslator = getTranslator;
exports.getIdentity = getIdentity;
exports.RecordTranslator = void 0;

var _core = _interopRequireDefault(require("./../core"));

var _object = require("./../helpers/object");

var _indexMapper = _interopRequireDefault(require("./indexMapper"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * @class RecordTranslator
 * @util
 */
var RecordTranslator =
/*#__PURE__*/
function () {
  function RecordTranslator(hot) {
    _classCallCheck(this, RecordTranslator);

    this.hot = hot;
    this.rowIndexMapper = new _indexMapper.default();
    this.columnIndexMapper = new _indexMapper.default();
  }
  /**
   * Translate physical row index into visual.
   *
   * @param {Number} row Physical row index.
   * @returns {Number} Returns visual row index.
   */


  _createClass(RecordTranslator, [{
    key: "toVisualRow",
    value: function toVisualRow(row) {
      return this.hot.runHooks('unmodifyRow', this.getRowIndexMapper().getVisualIndex(row));
    }
    /**
     * Translate physical column index into visual.
     *
     * @param {Number} column Physical column index.
     * @returns {Number} Returns visual column index.
     */

  }, {
    key: "toVisualColumn",
    value: function toVisualColumn(column) {
      return this.hot.runHooks('unmodifyCol', this.getColumnIndexMapper().getVisualIndex(column));
    }
    /**
     * Translate physical coordinates into visual. Can be passed as separate 2 arguments (row, column) or as an object in first
     * argument with `row` and `column` keys.
     *
     * @param {Number|Object} row Physical coordinates or row index.
     * @param {Number} [column] Physical column index.
     * @returns {Object|Array} Returns an object with visual records or an array if coordinates passed as separate arguments.
     */

  }, {
    key: "toVisual",
    value: function toVisual(row, column) {
      var result;

      if ((0, _object.isObject)(row)) {
        result = {
          row: this.toVisualRow(row.row),
          column: this.toVisualColumn(row.column)
        };
      } else {
        result = [this.toVisualRow(row), this.toVisualColumn(column)];
      }

      return result;
    }
    /**
     * Translate visual row index into physical.
     *
     * @param {Number} row Visual row index.
     * @returns {Number} Returns physical row index.
     */

  }, {
    key: "toPhysicalRow",
    value: function toPhysicalRow(row) {
      return this.hot.runHooks('modifyRow', this.getRowIndexMapper().getPhysicalIndex(row));
    }
    /**
     * Translate visual column index into physical.
     *
     * @param {Number} column Visual column index.
     * @returns {Number} Returns physical column index.
     */

  }, {
    key: "toPhysicalColumn",
    value: function toPhysicalColumn(column) {
      return this.hot.runHooks('modifyCol', this.getColumnIndexMapper().getPhysicalIndex(column));
    }
    /**
     * Translate visual coordinates into physical. Can be passed as separate 2 arguments (row, column) or as an object in first
     * argument with `row` and `column` keys.
     *
     * @param {Number|Object} row Visual coordinates or row index.
     * @param {Number} [column] Visual column index.
     * @returns {Object|Array} Returns an object with physical records or an array if coordinates passed as separate arguments.
     */

  }, {
    key: "toPhysical",
    value: function toPhysical(row, column) {
      var result;

      if ((0, _object.isObject)(row)) {
        result = {
          row: this.toPhysicalRow(row.row),
          column: this.toPhysicalColumn(row.column)
        };
      } else {
        result = [this.toPhysicalRow(row), this.toPhysicalColumn(column)];
      }

      return result;
    }
    /**
     * Get index mapper for rows.
     *
     * @returns {IndexMapper}
     */

  }, {
    key: "getRowIndexMapper",
    value: function getRowIndexMapper() {
      return this.rowIndexMapper;
    }
    /**
     * Get index mapper for columns.
     *
     * @returns {IndexMapper}
     */

  }, {
    key: "getColumnIndexMapper",
    value: function getColumnIndexMapper() {
      return this.columnIndexMapper;
    }
  }]);

  return RecordTranslator;
}();

exports.RecordTranslator = RecordTranslator;
var identities = new WeakMap();
var translatorSingletons = new WeakMap();
/**
 * Allows to register custom identity manually.
 *
 * @param {*} identity
 * @param {*} hot
 */

function registerIdentity(identity, hot) {
  identities.set(identity, hot);
}
/**
 * Returns a cached instance of RecordTranslator or create the new one for given identity.
 *
 * @param {*} identity
 * @returns {RecordTranslator}
 */


function getTranslator(identity) {
  var instance = identity instanceof _core.default ? identity : getIdentity(identity);
  var singleton;

  if (translatorSingletons.has(instance)) {
    singleton = translatorSingletons.get(instance);
  } else {
    singleton = new RecordTranslator(instance);
    translatorSingletons.set(instance, singleton);
  }

  return singleton;
}
/**
 * Returns mapped identity.
 *
 * @param {*} identity
 * @returns {*}
 */


function getIdentity(identity) {
  if (!identities.has(identity)) {
    throw Error('Record translator was not registered for this object identity');
  }

  return identities.get(identity);
}