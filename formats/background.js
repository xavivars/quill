"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackgroundStyle = exports.BackgroundClass = void 0;
const parchment_1 = require("parchment");
const color_1 = require("./color");
const BackgroundClass = new parchment_1.ClassAttributor('background', 'ql-bg', {
    scope: parchment_1.Scope.INLINE,
});
exports.BackgroundClass = BackgroundClass;
const BackgroundStyle = new color_1.ColorAttributor('background', 'background-color', {
    scope: parchment_1.Scope.INLINE,
});
exports.BackgroundStyle = BackgroundStyle;
//# sourceMappingURL=background.js.map