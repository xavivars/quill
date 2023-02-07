"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DirectionStyle = exports.DirectionClass = exports.DirectionAttribute = void 0;
const parchment_1 = require("parchment");
const config = {
    scope: parchment_1.Scope.BLOCK,
    whitelist: ['rtl'],
};
const DirectionAttribute = new parchment_1.Attributor('direction', 'dir', config);
exports.DirectionAttribute = DirectionAttribute;
const DirectionClass = new parchment_1.ClassAttributor('direction', 'ql-direction', config);
exports.DirectionClass = DirectionClass;
const DirectionStyle = new parchment_1.StyleAttributor('direction', 'direction', config);
exports.DirectionStyle = DirectionStyle;
//# sourceMappingURL=direction.js.map