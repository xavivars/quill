"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const embed_1 = __importDefault(require("../blots/embed"));
class Formula extends embed_1.default {
    static create(value) {
        // @ts-expect-error
        if (window.katex == null) {
            throw new Error('Formula module requires KaTeX.');
        }
        const node = super.create(value);
        if (typeof value === 'string') {
            // @ts-expect-error
            window.katex.render(value, node, {
                throwOnError: false,
                errorColor: '#f00',
            });
            node.setAttribute('data-value', value);
        }
        return node;
    }
    static value(domNode) {
        return domNode.getAttribute('data-value');
    }
    html() {
        const { formula } = this.value();
        return `<span>${formula}</span>`;
    }
}
Formula.blotName = 'formula';
Formula.className = 'ql-formula';
Formula.tagName = 'SPAN';
exports.default = Formula;
//# sourceMappingURL=formula.js.map