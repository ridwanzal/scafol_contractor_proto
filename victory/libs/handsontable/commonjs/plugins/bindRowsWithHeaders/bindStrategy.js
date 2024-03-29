"use strict";

require("core-js/modules/es.object.get-own-property-descriptor");

exports.__esModule = true;
exports.default = void 0;

var _number = require("../../helpers/number");

var _string = require("../../helpers/string");

var strategies = _interopRequireWildcard(require("./bindStrategies"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * @class BindStrategy
 * @plugin BindRowsWithHeaders
 */
var BindStrategy =
/*#__PURE__*/
function () {
  _createClass(BindStrategy, null, [{
    key: "DEFAULT_STRATEGY",

    /**
     * Loose bind mode.
     *
     * @returns {String}
     */
    get: function get() {
      return 'loose';
    }
  }]);

  function BindStrategy() {
    _classCallCheck(this, BindStrategy);

    this.strategy = null;
  }
  /**
   * Set strategy behaviors for binding rows with headers.
   *
   * @param name
   */


  _createClass(BindStrategy, [{
    key: "setStrategy",
    value: function setStrategy(name) {
      var Strategy = strategies[(0, _string.toUpperCaseFirst)(name)];

      if (!Strategy) {
        throw new Error("Bind strategy \"".concat(name, "\" does not exist."));
      }

      this.strategy = new Strategy();
    }
    /**
     * Reset current map array and create a new one.
     *
     * @param {Number} [length] Custom generated map length.
     */

  }, {
    key: "createMap",
    value: function createMap(length) {
      var strategy = this.strategy;
      var originLength = length === void 0 ? strategy._arrayMap.length : length;
      strategy._arrayMap.length = 0;
      (0, _number.rangeEach)(originLength - 1, function (itemIndex) {
        strategy._arrayMap.push(itemIndex);
      });
    }
    /**
     * Alias for createRow of strategy class.
     *
     * @param {*} params
     */

  }, {
    key: "createRow",
    value: function createRow() {
      var _this$strategy;

      (_this$strategy = this.strategy).createRow.apply(_this$strategy, arguments);
    }
    /**
     * Alias for removeRow of strategy class.
     *
     * @param {*} params
     */

  }, {
    key: "removeRow",
    value: function removeRow() {
      var _this$strategy2;

      (_this$strategy2 = this.strategy).removeRow.apply(_this$strategy2, arguments);
    }
    /**
     * Alias for getValueByIndex of strategy class.
     *
     * @param {*} params
     */

  }, {
    key: "translate",
    value: function translate() {
      var _this$strategy3;

      return (_this$strategy3 = this.strategy).getValueByIndex.apply(_this$strategy3, arguments);
    }
    /**
     * Clear array map.
     */

  }, {
    key: "clearMap",
    value: function clearMap() {
      this.strategy.clearMap();
    }
    /**
     * Destroy class.
     */

  }, {
    key: "destroy",
    value: function destroy() {
      if (this.strategy) {
        this.strategy.destroy();
      }

      this.strategy = null;
    }
  }]);

  return BindStrategy;
}();

var _default = BindStrategy;
exports.default = _default;