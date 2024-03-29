"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.symbol.iterator");

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.filter");

require("core-js/modules/es.array.find-index");

require("core-js/modules/es.array.from");

require("core-js/modules/es.array.includes");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.array.join");

require("core-js/modules/es.array.splice");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.regexp.to-string");

require("core-js/modules/es.string.includes");

require("core-js/modules/es.string.iterator");

require("core-js/modules/es.string.replace");

require("core-js/modules/web.dom-collections.iterator");

exports.__esModule = true;
exports.instanceToHTML = instanceToHTML;
exports._dataToHTML = _dataToHTML;
exports.htmlToGridSettings = htmlToGridSettings;

var _mixed = require("./../helpers/mixed");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

/**
 * Verifies if node is an HTMLTable element.
 *
 * @param {Node} element Node to verify if it's an HTMLTable.
 * @returns {Boolean}
 */
function isHTMLTable(element) {
  return (element && element.nodeName || '') === 'TABLE';
}
/**
 * Converts Handsontable into HTMLTableElement.
 *
 * @param {Core} instance
 * @returns {String} outerHTML of the HTMLTableElement
 */


function instanceToHTML(instance) {
  var hasColumnHeaders = instance.hasColHeaders();
  var hasRowHeaders = instance.hasRowHeaders();
  var coords = [hasColumnHeaders ? -1 : 0, hasRowHeaders ? -1 : 0, instance.countRows() - 1, instance.countCols() - 1];
  var data = instance.getData.apply(instance, coords);
  var countRows = data.length;
  var countCols = countRows > 0 ? data[0].length : 0;
  var TABLE = ['<table>', '</table>'];
  var THEAD = hasColumnHeaders ? ['<thead>', '</thead>'] : [];
  var TBODY = ['<tbody>', '</tbody>'];
  var rowModifier = hasRowHeaders ? 1 : 0;
  var columnModifier = hasColumnHeaders ? 1 : 0;

  for (var row = 0; row < countRows; row += 1) {
    var isColumnHeadersRow = hasColumnHeaders && row === 0;
    var CELLS = [];

    for (var column = 0; column < countCols; column += 1) {
      var isRowHeadersColumn = !isColumnHeadersRow && hasRowHeaders && column === 0;
      var cell = '';

      if (isColumnHeadersRow) {
        cell = "<th>".concat(instance.getColHeader(column - rowModifier), "</th>");
      } else if (isRowHeadersColumn) {
        cell = "<th>".concat(instance.getRowHeader(row - columnModifier), "</th>");
      } else {
        var cellData = data[row][column];

        var _instance$getCellMeta = instance.getCellMeta(row - rowModifier, column - columnModifier),
            hidden = _instance$getCellMeta.hidden,
            rowspan = _instance$getCellMeta.rowspan,
            colspan = _instance$getCellMeta.colspan;

        if (!hidden) {
          var attrs = [];

          if (rowspan) {
            attrs.push("rowspan=\"".concat(rowspan, "\""));
          }

          if (colspan) {
            attrs.push("colspan=\"".concat(colspan, "\""));
          }

          if ((0, _mixed.isEmpty)(cellData)) {
            cell = "<td ".concat(attrs.join(' '), "></td>");
          } else {
            var value = cellData.toString().replace(/(<br(\s*|\/)>(\r\n|\n)?|\r\n|\n)/g, '<br>\r\n').replace(/\x20/gi, '&nbsp;').replace(/\t/gi, '&#9;');
            cell = "<td ".concat(attrs.join(' '), ">").concat(value, "</td>");
          }
        }
      }

      CELLS.push(cell);
    }

    var TR = ['<tr>'].concat(CELLS, ['</tr>']).join('');

    if (isColumnHeadersRow) {
      THEAD.splice(1, 0, TR);
    } else {
      TBODY.splice(-1, 0, TR);
    }
  }

  TABLE.splice(1, 0, THEAD.join(''), TBODY.join(''));
  return TABLE.join('');
}
/**
 * Converts 2D array into HTMLTableElement.
 *
 * @param {Array} input Input array which will be converted to HTMLTable
 * @returns {String} outerHTML of the HTMLTableElement
 */
// eslint-disable-next-line no-restricted-globals


function _dataToHTML(input) {
  var inputLen = input.length;
  var result = ['<table>'];

  for (var row = 0; row < inputLen; row += 1) {
    var rowData = input[row];
    var columnsLen = rowData.length;
    var columnsResult = [];

    if (row === 0) {
      result.push('<tbody>');
    }

    for (var column = 0; column < columnsLen; column += 1) {
      var cellData = rowData[column];
      var parsedCellData = (0, _mixed.isEmpty)(cellData) ? '' : cellData.toString().replace(/(<br(\s*|\/)>(\r\n|\n)?|\r\n|\n)/g, '<br>\r\n').replace(/\x20/gi, '&nbsp;').replace(/\t/gi, '&#9;');
      columnsResult.push("<td>".concat(parsedCellData, "</td>"));
    }

    result.push.apply(result, ['<tr>'].concat(columnsResult, ['</tr>']));

    if (row + 1 === inputLen) {
      result.push('</tbody>');
    }
  }

  result.push('</table>');
  return result.join('');
}
/**
 * Helper to verify and get CSSRules for the element.
 *
 * @param {Element} element Element to verify with selector text.
 * @param {String} selector Selector text from CSSRule.
 */


function matchCSSRules(element, selector) {
  var result;

  if (element.msMatchesSelector) {
    result = element.msMatchesSelector(selector);
  } else if (element.matches) {
    result = element.matches(selector);
  }

  return result;
}
/**
 * Converts HTMLTable or string into Handsontable configuration object.
 *
 * @param {Element|String} element Node element which should contain `<table>...</table>`.
 * @param {Document} [rootDocument]
 * @returns {Object} Return configuration object. Contains keys as DefaultSettings.
 */
// eslint-disable-next-line no-restricted-globals


function htmlToGridSettings(element) {
  var rootDocument = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
  var settingsObj = {};
  var fragment = rootDocument.createDocumentFragment();
  var tempElem = rootDocument.createElement('div');
  fragment.appendChild(tempElem);
  var checkElement = element;

  if (typeof checkElement === 'string') {
    tempElem.insertAdjacentHTML('afterbegin', "".concat(checkElement));
    checkElement = tempElem.querySelector('table');
  }

  if (!checkElement || !isHTMLTable(checkElement)) {
    return;
  }

  var styleElem = tempElem.querySelector('style');
  var styleSheet = null;
  var styleSheetArr = [];

  if (styleElem) {
    rootDocument.body.appendChild(styleElem);
    styleElem.disabled = true;
    styleSheet = styleElem.sheet;
    styleSheetArr = styleSheet ? Array.from(styleSheet.cssRules) : [];
    rootDocument.body.removeChild(styleElem);
  }

  var generator = tempElem.querySelector('meta[name$="enerator"]');
  var hasRowHeaders = checkElement.querySelector('tbody th') !== null;
  var countCols = Array.from(checkElement.querySelector('tr').cells).reduce(function (cols, cell) {
    return cols + cell.colSpan;
  }, 0) - (hasRowHeaders ? 1 : 0);
  var fixedRowsBottom = checkElement.tFoot && Array.from(checkElement.tFoot.rows) || [];
  var fixedRowsTop = [];
  var hasColHeaders = false;
  var thRowsLen = 0;
  var countRows = 0;

  if (checkElement.tHead) {
    var thRows = Array.from(checkElement.tHead.rows).filter(function (tr) {
      var isDataRow = tr.querySelector('td') !== null;

      if (isDataRow) {
        fixedRowsTop.push(tr);
      }

      return !isDataRow;
    });
    thRowsLen = thRows.length;
    hasColHeaders = thRowsLen > 0;

    if (thRowsLen > 1) {
      settingsObj.nestedHeaders = Array.from(thRows).reduce(function (rows, row) {
        var headersRow = Array.from(row.cells).reduce(function (headers, header, currentIndex) {
          if (hasRowHeaders && currentIndex === 0) {
            return headers;
          }

          var colspan = header.colSpan,
              innerHTML = header.innerHTML;
          var nextHeader = colspan > 1 ? {
            label: innerHTML,
            colspan: colspan
          } : innerHTML;
          headers.push(nextHeader);
          return headers;
        }, []);
        rows.push(headersRow);
        return rows;
      }, []);
    } else if (hasColHeaders) {
      settingsObj.colHeaders = Array.from(thRows[0].children).reduce(function (headers, header, index) {
        if (hasRowHeaders && index === 0) {
          return headers;
        }

        headers.push(header.innerHTML);
        return headers;
      }, []);
    }
  }

  if (fixedRowsTop.length) {
    settingsObj.fixedRowsTop = fixedRowsTop.length;
  }

  if (fixedRowsBottom.length) {
    settingsObj.fixedRowsBottom = fixedRowsBottom.length;
  }

  var dataRows = [].concat(fixedRowsTop, _toConsumableArray(Array.from(checkElement.tBodies).reduce(function (sections, section) {
    sections.push.apply(sections, _toConsumableArray(section.rows));
    return sections;
  }, [])), _toConsumableArray(fixedRowsBottom));
  countRows = dataRows.length;
  var dataArr = Array(countRows);

  for (var r = 0; r < countRows; r++) {
    dataArr[r] = Array(countCols);
  }

  var mergeCells = [];
  var rowHeaders = [];

  for (var row = 0; row < countRows; row++) {
    var tr = dataRows[row];
    var cells = Array.from(tr.cells);
    var cellsLen = cells.length;

    var _loop = function _loop(cellId) {
      var cell = cells[cellId];
      var nodeName = cell.nodeName,
          innerHTML = cell.innerHTML,
          rowspan = cell.rowSpan,
          colspan = cell.colSpan;
      var col = dataArr[row].findIndex(function (value) {
        return value === void 0;
      });

      if (nodeName === 'TD') {
        if (rowspan > 1 || colspan > 1) {
          for (var rstart = row; rstart < row + rowspan; rstart++) {
            if (rstart < countRows) {
              for (var cstart = col; cstart < col + colspan; cstart++) {
                dataArr[rstart][cstart] = null;
              }
            }
          }

          var styleAttr = cell.getAttribute('style');
          var ignoreMerge = styleAttr && styleAttr.includes('mso-ignore:colspan');

          if (!ignoreMerge) {
            mergeCells.push({
              col: col,
              row: row,
              rowspan: rowspan,
              colspan: colspan
            });
          }
        }

        var cellStyle = styleSheetArr.reduce(function (settings, cssRule) {
          if (cssRule.selectorText && matchCSSRules(cell, cssRule.selectorText)) {
            var whiteSpace = cssRule.style.whiteSpace;

            if (whiteSpace) {
              settings.whiteSpace = whiteSpace;
            }
          }

          return settings;
        }, {});

        if (cellStyle.whiteSpace === 'nowrap') {
          dataArr[row][col] = innerHTML.replace(/[\r\n][\x20]{0,2}/gim, '\x20').replace(/<br(\s*|\/)>/gim, '\r\n').replace(/(<([^>]+)>)/gi, '').replace(/&nbsp;/gi, '\x20');
        } else if (generator && /excel/gi.test(generator.content)) {
          dataArr[row][col] = innerHTML.replace(/<br(\s*|\/)>[\r\n]?[\x20]{0,2}/gim, '\r\n').replace(/(<([^>]+)>)/gi, '').replace(/&nbsp;/gi, '\x20');
        } else {
          dataArr[row][col] = innerHTML.replace(/<br(\s*|\/)>[\r\n]?/gim, '\r\n').replace(/(<([^>]+)>)/gi, '').replace(/&nbsp;/gi, '\x20');
        }
      } else {
        rowHeaders.push(innerHTML);
      }
    };

    for (var cellId = 0; cellId < cellsLen; cellId++) {
      _loop(cellId);
    }
  }

  if (mergeCells.length) {
    settingsObj.mergeCells = mergeCells;
  }

  if (rowHeaders.length) {
    settingsObj.rowHeaders = rowHeaders;
  }

  if (dataArr.length) {
    settingsObj.data = dataArr;
  }

  return settingsObj;
}