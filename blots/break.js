"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parchment_1 = require("parchment");
class Break extends parchment_1.EmbedBlot {
    static value() {
        return undefined;
    }
    optimize() {
        if (this.prev || this.next) {
            this.remove();
        }
    }
    length() {
        return 0;
    }
    value() {
        return '';
    }
}
Break.blotName = 'break';
Break.tagName = 'BR';
exports.default = Break;
//# sourceMappingURL=break.js.map