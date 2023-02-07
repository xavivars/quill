"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const picker_1 = __importDefault(require("./picker"));
class IconPicker extends picker_1.default {
    constructor(select, icons) {
        super(select);
        this.container.classList.add('ql-icon-picker');
        Array.from(this.container.querySelectorAll('.ql-picker-item')).forEach(item => {
            item.innerHTML = icons[item.getAttribute('data-value') || ''];
        });
        this.defaultItem = this.container.querySelector('.ql-selected');
        // @ts-expect-error
        this.selectItem(this.defaultItem);
    }
    selectItem(target, trigger) {
        super.selectItem(target, trigger);
        const item = target || this.defaultItem;
        if (this.label.innerHTML === item.innerHTML)
            return;
        this.label.innerHTML = item.innerHTML;
    }
}
exports.default = IconPicker;
//# sourceMappingURL=icon-picker.js.map