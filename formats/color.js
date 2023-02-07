"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorStyle = exports.ColorClass = exports.ColorAttributor = void 0;
const parchment_1 = require("parchment");
class ColorAttributor extends parchment_1.StyleAttributor {
    value(domNode) {
        let value = super.value(domNode);
        if (!value.startsWith('rgb('))
            return value;
        value = value.replace(/^[^\d]+/, '').replace(/[^\d]+$/, '');
        const hex = value
            .split(',')
            .map(component => `00${parseInt(component, 10).toString(16)}`.slice(-2))
            .join('');
        return `#${hex}`;
    }
}
exports.ColorAttributor = ColorAttributor;
const ColorClass = new parchment_1.ClassAttributor('color', 'ql-color', {
    scope: parchment_1.Scope.INLINE,
});
exports.ColorClass = ColorClass;
const ColorStyle = new ColorAttributor('color', 'color', {
    scope: parchment_1.Scope.INLINE,
});
exports.ColorStyle = ColorStyle;
//# sourceMappingURL=color.js.map