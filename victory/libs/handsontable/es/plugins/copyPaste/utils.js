import "core-js/modules/es.array.concat";
import "core-js/modules/es.array.join";
import "core-js/modules/es.string.replace";
import "core-js/modules/es.string.trim";
import { isEmpty } from './../../helpers/mixed';
/**
 * Converts javascript array into HTMLTable.
 *
 * @param {Array} input Input array which will be converted to HTMLTable
 */

export function arrayToTable(input, rootDocument) {
  var inputLen = input.length;
  var result = ['<table>'];
  var tempElement = rootDocument.createElement('div');
  rootDocument.documentElement.appendChild(tempElement);

  for (var row = 0; row < inputLen; row += 1) {
    var rowData = input[row];
    var columnsLen = rowData.length;
    var columnsResult = [];

    if (row === 0) {
      result.push('<tbody>');
    }

    for (var column = 0; column < columnsLen; column += 1) {
      tempElement.innerText = "".concat(isEmpty(rowData[column]) ? '' : rowData[column]);
      columnsResult.push("<td>".concat(tempElement.innerHTML, "</td>"));
    }

    result.push.apply(result, ['<tr>'].concat(columnsResult, ['</tr>']));

    if (row + 1 === inputLen) {
      result.push('</tbody>');
    }
  }

  rootDocument.documentElement.removeChild(tempElement);
  result.push('</table>');
  return result.join('');
}
/**
 * Helper to verify if DOM element is an HTMLTable element.
 *
 * @param {Element} element Node element to verify if it's an HTMLTable.
 */

function isHTMLTable(element) {
  return (element && element.nodeName || '').toLowerCase() === 'table';
}
/**
 * Converts HTMLTable or string into array.
 *
 * @param {Element|String} element Node element or string, which should contain `<table>...</table>`.
 */


export function tableToArray(element, rootDocument) {
  var result = [];
  var checkElement = element;

  if (typeof checkElement === 'string') {
    var tempElem = rootDocument.createElement('div');
    tempElem.innerHTML = checkElement.replace(/\n/g, '');
    checkElement = tempElem.querySelector('table');
  }

  if (checkElement && isHTMLTable(checkElement)) {
    var rows = checkElement.rows;
    var rowsLen = rows && rows.length;
    var tempArray = [];

    for (var row = 0; row < rowsLen; row += 1) {
      var cells = rows[row].cells;
      var cellsLen = cells.length;
      var newRow = [];

      for (var column = 0; column < cellsLen; column += 1) {
        var cell = cells[column];
        cell.innerHTML = cell.innerHTML.trim().replace(/<br(.|)>(\n?)/, '\n');
        var cellText = cell.innerText;
        newRow.push(cellText);
      }

      tempArray.push(newRow);
    }

    result.push.apply(result, tempArray);
  }

  return result;
}