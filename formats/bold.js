"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inline_1 = require("../blots/inline");
// @ts-expect-error TODO: Inline.tagName should be string[] | string
class Bold extends inline_1.default {
    static create() {
        // @ts-expect-error
        return super.create();
    }
    static formats() {
        return true;
    }
    optimize(context) {
        super.optimize(context);
        if (this.domNode.tagName !== this.statics.tagName[0]) {
            this.replaceWith(this.statics.blotName);
        }
    }
}
Bold.blotName = 'bold';
Bold.tagName = ['STRONG', 'B'];
exports.default = Bold;
//# sourceMappingURL=bold.js.map