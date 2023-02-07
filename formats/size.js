"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SizeStyle = exports.SizeClass = void 0;
const parchment_1 = require("parchment");
const SizeClass = new parchment_1.ClassAttributor('size', 'ql-size', {
    scope: parchment_1.Scope.INLINE,
    whitelist: ['small', 'large', 'huge'],
});
exports.SizeClass = SizeClass;
const SizeStyle = new parchment_1.StyleAttributor('size', 'font-size', {
    scope: parchment_1.Scope.INLINE,
    whitelist: ['10px', '18px', '32px'],
});
exports.SizeStyle = SizeStyle;
//# sourceMappingURL=size.js.map