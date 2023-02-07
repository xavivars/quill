"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const picker_1 = require("./picker");
class ColorPicker extends picker_1.default {
    constructor(select, label) {
        super(select);
        this.label.innerHTML = label;
        this.container.classList.add('ql-color-picker');
        Array.from(this.container.querySelectorAll('.ql-picker-item'))
            .slice(0, 7)
            .forEach(item => {
            item.classList.add('ql-primary');
        });
    }
    buildItem(option) {
        const item = super.buildItem(option);
        item.style.backgroundColor = option.getAttribute('value') || '';
        return item;
    }
    selectItem(item, trigger) {
        super.selectItem(item, trigger);
        const colorLabel = this.label.querySelector('.ql-color-label');
        const value = item ? item.getAttribute('data-value') || '' : '';
        if (colorLabel) {
            if (colorLabel.tagName === 'line') {
                // @ts-expect-error
                colorLabel.style.stroke = value;
            }
            else {
                // @ts-expect-error
                colorLabel.style.fill = value;
            }
        }
    }
}
exports.default = ColorPicker;
//# sourceMappingURL=color-picker.js.map