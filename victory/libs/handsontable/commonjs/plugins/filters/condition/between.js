"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.symbol.iterator");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.object.get-own-property-descriptor");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.string.iterator");

require("core-js/modules/web.dom-collections.iterator");

exports.__esModule = true;
exports.condition = condition;
exports.CONDITION_NAME = void 0;

var C = _interopRequireWildcard(require("../../../i18n/constants"));

var _conditionRegisterer = require("../conditionRegisterer");

var _after = require("./date/after");

var _before = require("./date/before");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var CONDITION_NAME = 'between';
exports.CONDITION_NAME = CONDITION_NAME;

function condition(dataRow, _ref) {
  var _ref2 = _slicedToArray(_ref, 2),
      from = _ref2[0],
      to = _ref2[1];

  var fromValue = from;
  var toValue = to;

  if (dataRow.meta.type === 'numeric') {
    var _from = parseFloat(fromValue, 10);

    var _to = parseFloat(toValue, 10);

    fromValue = Math.min(_from, _to);
    toValue = Math.max(_from, _to);
  } else if (dataRow.meta.type === 'date') {
    var dateBefore = (0, _conditionRegisterer.getCondition)(_before.CONDITION_NAME, [toValue]);
    var dateAfter = (0, _conditionRegisterer.getCondition)(_after.CONDITION_NAME, [fromValue]);
    return dateBefore(dataRow) && dateAfter(dataRow);
  }

  return dataRow.value >= fromValue && dataRow.value <= toValue;
}

(0, _conditionRegisterer.registerCondition)(CONDITION_NAME, condition, {
  name: C.FILTERS_CONDITIONS_BETWEEN,
  inputsCount: 2,
  showOperators: true
});