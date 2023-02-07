"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const parchment_1 = require("parchment");
const break_1 = __importDefault(require("./break"));
const text_1 = __importDefault(require("./text"));
class Inline extends parchment_1.InlineBlot {
    static compare(self, other) {
        const selfIndex = Inline.order.indexOf(self);
        const otherIndex = Inline.order.indexOf(other);
        if (selfIndex >= 0 || otherIndex >= 0) {
            return selfIndex - otherIndex;
        }
        if (self === other) {
            return 0;
        }
        if (self < other) {
            return -1;
        }
        return 1;
    }
    formatAt(index, length, name, value) {
        if (Inline.compare(this.statics.blotName, name) < 0 &&
            this.scroll.query(name, parchment_1.Scope.BLOT)) {
            const blot = this.isolate(index, length);
            if (value) {
                blot.wrap(name, value);
            }
        }
        else {
            super.formatAt(index, length, name, value);
        }
    }
    optimize(context) {
        super.optimize(context);
        if (this.parent instanceof Inline &&
            Inline.compare(this.statics.blotName, this.parent.statics.blotName) > 0) {
            const parent = this.parent.isolate(this.offset(), this.length());
            // @ts-expect-error TODO: make isolate generic
            this.moveChildren(parent);
            parent.wrap(this);
        }
    }
}
Inline.allowedChildren = [Inline, break_1.default, parchment_1.EmbedBlot, text_1.default];
// Lower index means deeper in the DOM tree, since not found (-1) is for embeds
Inline.order = [
    'cursor',
    'inline',
    'link',
    'underline',
    'strike',
    'italic',
    'bold',
    'script',
    'code', // Must be higher
];
exports.default = Inline;
//# sourceMappingURL=inline.js.map