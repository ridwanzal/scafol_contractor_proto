"use strict";

require("core-js/modules/es.object.get-own-property-descriptor");

exports.__esModule = true;
exports.default = cutItem;

var C = _interopRequireWildcard(require("./../../../i18n/constants"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function cutItem(copyPastePlugin) {
  return {
    key: 'cut',
    name: function name() {
      return this.getTranslatedPhrase(C.CONTEXTMENU_ITEMS_CUT);
    },
    callback: function callback() {
      copyPastePlugin.cut();
    },
    disabled: function disabled() {
      var selected = this.getSelected();

      if (!selected || selected.length > 1) {
        return true;
      }

      return false;
    },
    hidden: false
  };
}