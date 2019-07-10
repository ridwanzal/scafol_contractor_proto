"use strict";

exports.__esModule = true;
exports.default = numericValidator;

var _number = require("./../helpers/number");

/**
 * Numeric cell validator
 *
 * @private
 * @validator NumericValidator
 * @param {*} value - Value of edited cell
 * @param {*} callback - Callback called with validation result
 */
function numericValidator(value, callback) {
  var valueToValidate = value;

  if (valueToValidate === null || valueToValidate === void 0) {
    valueToValidate = '';
  }

  if (this.allowEmpty && valueToValidate === '') {
    callback(true);
  } else if (valueToValidate === '') {
    callback(false);
  } else {
    callback((0, _number.isNumeric)(value));
  }
}