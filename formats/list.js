"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exports.ListContainer = void 0;
const block_1 = __importDefault(require("../blots/block"));
const container_1 = __importDefault(require("../blots/container"));
const quill_1 = __importDefault(require("../core/quill"));
class ListContainer extends container_1.default {
}
exports.ListContainer = ListContainer;
ListContainer.blotName = 'list-container';
ListContainer.tagName = 'OL';
class ListItem extends block_1.default {
    static create(value) {
        // @ts-expect-error
        const node = super.create();
        node.setAttribute('data-list', value);
        return node;
    }
    static formats(domNode) {
        return domNode.getAttribute('data-list') || undefined;
    }
    static register() {
        quill_1.default.register(ListContainer);
    }
    constructor(scroll, domNode) {
        super(scroll, domNode);
        const ui = domNode.ownerDocument.createElement('span');
        const listEventHandler = e => {
            if (!scroll.isEnabled())
                return;
            const format = this.statics.formats(domNode, scroll);
            if (format === 'checked') {
                this.format('list', 'unchecked');
                e.preventDefault();
            }
            else if (format === 'unchecked') {
                this.format('list', 'checked');
                e.preventDefault();
            }
        };
        ui.addEventListener('mousedown', listEventHandler);
        ui.addEventListener('touchstart', listEventHandler);
        this.attachUI(ui);
    }
    format(name, value) {
        if (name === this.statics.blotName && value) {
            this.domNode.setAttribute('data-list', value);
        }
        else {
            super.format(name, value);
        }
    }
}
exports.default = ListItem;
ListItem.blotName = 'list';
ListItem.tagName = 'LI';
ListContainer.allowedChildren = [ListItem];
ListItem.requiredContainer = ListContainer;
//# sourceMappingURL=list.js.map