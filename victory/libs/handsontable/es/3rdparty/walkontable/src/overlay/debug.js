import "core-js/modules/es.symbol";
import "core-js/modules/es.symbol.description";
import "core-js/modules/es.symbol.iterator";
import "core-js/modules/es.array.iterator";
import "core-js/modules/es.object.get-prototype-of";
import "core-js/modules/es.object.set-prototype-of";
import "core-js/modules/es.object.to-string";
import "core-js/modules/es.string.iterator";
import "core-js/modules/web.dom-collections.iterator";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

import { addClass } from './../../../../helpers/dom/element';
import Overlay from './_base';
/**
 * A overlay that renders ALL available rows & columns positioned on top of the original Walkontable instance and all other overlays.
 * Used for debugging purposes to see if the other overlays (that render only part of the rows & columns) are positioned correctly
 *
 * @class DebugOverlay
 */

var DebugOverlay =
/*#__PURE__*/
function (_Overlay) {
  _inherits(DebugOverlay, _Overlay);

  /**
   * @param {Walkontable} wotInstance
   */
  function DebugOverlay(wotInstance) {
    var _this;

    _classCallCheck(this, DebugOverlay);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DebugOverlay).call(this, wotInstance));
    _this.clone = _this.makeClone(Overlay.CLONE_DEBUG);
    _this.clone.wtTable.holder.style.opacity = 0.4;
    _this.clone.wtTable.holder.style.textShadow = '0 0 2px #ff0000';
    addClass(_this.clone.wtTable.holder.parentNode, 'wtDebugVisible');
    return _this;
  }

  return DebugOverlay;
}(Overlay);

Overlay.registerOverlay(Overlay.CLONE_DEBUG, DebugOverlay);
export default DebugOverlay;