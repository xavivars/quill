"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSelectionInTextNode = exports.SHORTKEY = void 0;
exports.SHORTKEY = process.platform === 'darwin' ? 'Meta' : 'Control';
function getSelectionInTextNode() {
    const { anchorNode, anchorOffset, focusNode, focusOffset } = document.getSelection();
    return JSON.stringify([
        anchorNode.data,
        anchorOffset,
        focusNode.data,
        focusOffset,
    ]);
}
exports.getSelectionInTextNode = getSelectionInTextNode;
//# sourceMappingURL=index.js.map