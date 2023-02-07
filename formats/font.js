"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FontClass = exports.FontStyle = void 0;
const parchment_1 = require("parchment");
const config = {
    scope: parchment_1.Scope.INLINE,
    whitelist: ['serif', 'monospace'],
};
const FontClass = new parchment_1.ClassAttributor('font', 'ql-font', config);
exports.FontClass = FontClass;
class FontStyleAttributor extends parchment_1.StyleAttributor {
    value(node) {
        return super.value(node).replace(/["']/g, '');
    }
}
const FontStyle = new FontStyleAttributor('font', 'font-family', config);
exports.FontStyle = FontStyle;
//# sourceMappingURL=font.js.map