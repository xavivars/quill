"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const block_1 = __importDefault(require("../blots/block"));
// @ts-expect-error TODO: BlockBlot.tagName should be string[] | string
class Header extends block_1.default {
    static formats(domNode) {
        return this.tagName.indexOf(domNode.tagName) + 1;
    }
}
Header.blotName = 'header';
Header.tagName = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'];
exports.default = Header;
//# sourceMappingURL=header.js.map