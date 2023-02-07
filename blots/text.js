"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.escapeText = exports.default = void 0;
const parchment_1 = require("parchment");
class Text extends parchment_1.TextBlot {
}
exports.default = Text;
function escapeText(text) {
    return text.replace(/[&<>"']/g, s => {
        // https://lodash.com/docs#escape
        const entityMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
        };
        return entityMap[s];
    });
}
exports.escapeText = escapeText;
//# sourceMappingURL=text.js.map