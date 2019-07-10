import { getEditor } from './../editors';
import { getRenderer } from './../renderers';
var CELL_TYPE = 'text';
export default {
  editor: getEditor(CELL_TYPE),
  renderer: getRenderer(CELL_TYPE)
};