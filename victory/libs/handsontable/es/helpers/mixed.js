import "core-js/modules/es.symbol";
import "core-js/modules/es.symbol.description";
import "core-js/modules/es.symbol.iterator";
import "core-js/modules/es.array.iterator";
import "core-js/modules/es.array.slice";
import "core-js/modules/es.object.freeze";
import "core-js/modules/es.object.to-string";
import "core-js/modules/es.regexp.to-string";
import "core-js/modules/es.string.code-point-at";
import "core-js/modules/es.string.iterator";
import "core-js/modules/es.string.pad-start";
import "core-js/modules/es.string.replace";
import "core-js/modules/es.string.split";
import "core-js/modules/web.dom-collections.iterator";

function _templateObject6() {
  var data = _taggedTemplateLiteral(["\n    The license key for Handsontable is missing. Use your purchased key to activate the product. \n    Alternatively, you can activate Handsontable to use for non-commercial purposes by \n    passing the key: 'non-commercial-and-evaluation'. \n    <a href=\"https://handsontable.com/docs/tutorial-license-key.html\" target=\"_blank\">Read more</a> about it in \n    the documentation or contact us at <a href=\"mailto:support@handsontable.com\">support@handsontable.com</a>."], ["\n    The license key for Handsontable is missing. Use your purchased key to activate the product.\\x20\n    Alternatively, you can activate Handsontable to use for non-commercial purposes by\\x20\n    passing the key: 'non-commercial-and-evaluation'.\\x20\n    <a href=\"https://handsontable.com/docs/tutorial-license-key.html\" target=\"_blank\">Read more</a> about it in\\x20\n    the documentation or contact us at <a href=\"mailto:support@handsontable.com\">support@handsontable.com</a>."]);

  _templateObject6 = function _templateObject6() {
    return data;
  };

  return data;
}

function _templateObject5() {
  var data = _taggedTemplateLiteral(["\n    The license key for Handsontable expired on ", ", and is not valid for the installed \n    version ", ". <a href=\"https://handsontable.com/pricing\" target=\"_blank\">Renew</a> your \n    license key or downgrade to a version released prior to ", ". If you need any \n    help, contact us at <a href=\"mailto:sales@handsontable.com\">sales@handsontable.com</a>."], ["\n    The license key for Handsontable expired on ", ", and is not valid for the installed\\x20\n    version ", ". <a href=\"https://handsontable.com/pricing\" target=\"_blank\">Renew</a> your\\x20\n    license key or downgrade to a version released prior to ", ". If you need any\\x20\n    help, contact us at <a href=\"mailto:sales@handsontable.com\">sales@handsontable.com</a>."]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = _taggedTemplateLiteral(["\n    The license key for Handsontable is invalid. \n    <a href=\"https://handsontable.com/docs/tutorial-license-key.html\" target=\"_blank\">Read more</a> on how to \n    install it properly or contact us at <a href=\"mailto:support@handsontable.com\">support@handsontable.com</a>."], ["\n    The license key for Handsontable is invalid.\\x20\n    <a href=\"https://handsontable.com/docs/tutorial-license-key.html\" target=\"_blank\">Read more</a> on how to\\x20\n    install it properly or contact us at <a href=\"mailto:support@handsontable.com\">support@handsontable.com</a>."]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral(["\n    The license key for Handsontable is missing. Use your purchased key to activate the product. \n    Alternatively, you can activate Handsontable to use for non-commercial purposes by \n    passing the key: 'non-commercial-and-evaluation'. If you need any help, contact \n    us at support@handsontable.com."], ["\n    The license key for Handsontable is missing. Use your purchased key to activate the product.\\x20\n    Alternatively, you can activate Handsontable to use for non-commercial purposes by\\x20\n    passing the key: 'non-commercial-and-evaluation'. If you need any help, contact\\x20\n    us at support@handsontable.com."]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n    The license key for Handsontable expired on ", ", and is not valid for the installed \n    version ", ". Renew your license key at handsontable.com or downgrade to a version released prior \n    to ", ". If you need any help, contact us at sales@handsontable.com."], ["\n    The license key for Handsontable expired on ", ", and is not valid for the installed\\x20\n    version ", ". Renew your license key at handsontable.com or downgrade to a version released prior\\x20\n    to ", ". If you need any help, contact us at sales@handsontable.com."]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n    The license key for Handsontable is invalid. \n    If you need any help, contact us at support@handsontable.com."], ["\n    The license key for Handsontable is invalid.\\x20\n    If you need any help, contact us at support@handsontable.com."]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

import moment from 'moment';
import { toSingleLine } from './templateLiteralTag';
/**
 * Converts any value to string.
 *
 * @param {*} value
 * @returns {String}
 */

export function stringify(value) {
  var result;

  switch (_typeof(value)) {
    case 'string':
    case 'number':
      result = "".concat(value);
      break;

    case 'object':
      result = value === null ? '' : value.toString();
      break;

    case 'undefined':
      result = '';
      break;

    default:
      result = value.toString();
      break;
  }

  return result;
}
/**
 * Checks if given variable is defined.
 *
 * @param {*} variable Variable to check.
 * @returns {Boolean}
 */

export function isDefined(variable) {
  return typeof variable !== 'undefined';
}
/**
 * Checks if given variable is undefined.
 *
 * @param {*} variable Variable to check.
 * @returns {Boolean}
 */

export function isUndefined(variable) {
  return typeof variable === 'undefined';
}
/**
 * Check if given variable is null, empty string or undefined.
 *
 * @param {*} variable Variable to check.
 * @returns {Boolean}
 */

export function isEmpty(variable) {
  return variable === null || variable === '' || isUndefined(variable);
}
/**
 * Check if given variable is a regular expression.
 *
 * @param {*} variable Variable to check.
 * @returns {Boolean}
 */

export function isRegExp(variable) {
  return Object.prototype.toString.call(variable) === '[object RegExp]';
}
/* eslint-disable */

var _m = '\x6C\x65\x6E\x67\x74\x68';

var _hd = function _hd(v) {
  return parseInt(v, 16);
};

var _pi = function _pi(v) {
  return parseInt(v, 10);
};

var _ss = function _ss(v, s, l) {
  return v['\x73\x75\x62\x73\x74\x72'](s, l);
};

var _cp = function _cp(v) {
  return v['\x63\x6F\x64\x65\x50\x6F\x69\x6E\x74\x41\x74'](0) - 65;
};

var _norm = function _norm(v) {
  return "".concat(v).replace(/\-/g, '');
};

var _extractTime = function _extractTime(v) {
  return _hd(_ss(_norm(v), _hd('12'), _cp('\x46'))) / (_hd(_ss(_norm(v), _cp('\x42'), ~~![][_m])) || 9);
};

var _ignored = function _ignored() {
  return typeof location !== 'undefined' && /^([a-z0-9\-]+\.)?\x68\x61\x6E\x64\x73\x6F\x6E\x74\x61\x62\x6C\x65\x2E\x63\x6F\x6D$/i.test(location.host);
};

var _notified = false;
var consoleMessages = {
  invalid: function invalid() {
    return toSingleLine(_templateObject());
  },
  expired: function expired(_ref) {
    var keyValidityDate = _ref.keyValidityDate,
        hotVersion = _ref.hotVersion;
    return toSingleLine(_templateObject2(), keyValidityDate, hotVersion, keyValidityDate);
  },
  missing: function missing() {
    return toSingleLine(_templateObject3());
  },
  non_commercial: function non_commercial() {
    return '';
  }
};
var domMessages = {
  invalid: function invalid() {
    return toSingleLine(_templateObject4());
  },
  expired: function expired(_ref2) {
    var keyValidityDate = _ref2.keyValidityDate,
        hotVersion = _ref2.hotVersion;
    return toSingleLine(_templateObject5(), keyValidityDate, hotVersion, keyValidityDate);
  },
  missing: function missing() {
    return toSingleLine(_templateObject6());
  },
  non_commercial: function non_commercial() {
    return '';
  }
};
export function _injectProductInfo(key, element) {
  var hasValidType = !isEmpty(key);
  var isNonCommercial = typeof key === 'string' && key.toLowerCase() === 'non-commercial-and-evaluation';
  var hotVersion = "7.1.0";
  var keyValidityDate;
  var consoleMessageState = 'invalid';
  var domMessageState = 'invalid';
  key = _norm(key || '');

  var schemaValidity = _checkKeySchema(key);

  if (hasValidType || isNonCommercial || schemaValidity) {
    if (schemaValidity) {
      var releaseDate = moment("11/06/2019", 'DD/MM/YYYY');
      var releaseDays = Math.floor(releaseDate.toDate().getTime() / 8.64e7);

      var keyValidityDays = _extractTime(key);

      keyValidityDate = moment((keyValidityDays + 1) * 8.64e7, 'x').format('MMMM DD, YYYY');

      if (releaseDays > keyValidityDays) {
        var daysAfterRelease = moment().diff(releaseDate, 'days');
        consoleMessageState = daysAfterRelease <= 1 ? 'valid' : 'expired';
        domMessageState = daysAfterRelease <= 15 ? 'valid' : 'expired';
      } else {
        consoleMessageState = 'valid';
        domMessageState = 'valid';
      }
    } else if (isNonCommercial) {
      consoleMessageState = 'non_commercial';
      domMessageState = 'valid';
    } else {
      consoleMessageState = 'invalid';
      domMessageState = 'invalid';
    }
  } else {
    consoleMessageState = 'missing';
    domMessageState = 'missing';
  }

  if (_ignored()) {
    consoleMessageState = 'valid';
    domMessageState = 'valid';
  }

  if (!_notified && consoleMessageState !== 'valid') {
    var message = consoleMessages[consoleMessageState]({
      keyValidityDate: keyValidityDate,
      hotVersion: hotVersion
    });

    if (message) {
      console[consoleMessageState === 'non_commercial' ? 'info' : 'warn'](consoleMessages[consoleMessageState]({
        keyValidityDate: keyValidityDate,
        hotVersion: hotVersion
      }));
    }

    _notified = true;
  }

  if (domMessageState !== 'valid' && element.parentNode) {
    var _message = domMessages[domMessageState]({
      keyValidityDate: keyValidityDate,
      hotVersion: hotVersion
    });

    if (_message) {
      var messageNode = document.createElement('div');
      messageNode.id = 'hot-display-license-info';
      messageNode.innerHTML = domMessages[domMessageState]({
        keyValidityDate: keyValidityDate,
        hotVersion: hotVersion
      });
      element.parentNode.insertBefore(messageNode, element.nextSibling);
    }
  }
}

function _checkKeySchema(v) {
  var z = [][_m];
  var p = z;

  if (v[_m] !== _cp('\x5A')) {
    return false;
  }

  for (var c = '', i = '\x42\x3C\x48\x34\x50\x2B'.split(''), j = _cp(i.shift()); j; j = _cp(i.shift() || 'A')) {
    --j < ''[_m] ? p = p | (_pi("".concat(_pi(_hd(c) + (_hd(_ss(v, Math.abs(j), 2)) + []).padStart(2, '0')))) % 97 || 2) >> 1 : c = _ss(v, j, !j ? 6 : i[_m] === 1 ? 9 : 8);
  }

  return p === z;
}
/* eslint-enable */