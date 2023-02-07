"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlignStyle = exports.AlignClass = exports.AlignAttribute = void 0;
const parchment_1 = require("parchment");
const config = {
    scope: parchment_1.Scope.BLOCK,
    whitelist: ['right', 'center', 'justify'],
};
const AlignAttribute = new parchment_1.Attributor('align', 'align', config);
exports.AlignAttribute = AlignAttribute;
const AlignClass = new parchment_1.ClassAttributor('align', 'ql-align', config);
exports.AlignClass = AlignClass;
const AlignStyle = new parchment_1.StyleAttributor('align', 'text-align', config);
exports.AlignStyle = AlignStyle;
//# sourceMappingURL=align.js.map