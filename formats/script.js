"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inline_1 = __importDefault(require("../blots/inline"));
// @ts-expect-error TODO: Inline.tagName should be string[] | string
class Script extends inline_1.default {
    static create(value) {
        if (value === 'super') {
            return document.createElement('sup');
        }
        if (value === 'sub') {
            return document.createElement('sub');
        }
        return super.create(value);
    }
    static formats(domNode) {
        if (domNode.tagName === 'SUB')
            return 'sub';
        if (domNode.tagName === 'SUP')
            return 'super';
        return undefined;
    }
}
Script.blotName = 'script';
Script.tagName = ['SUB', 'SUP'];
exports.default = Script;
//# sourceMappingURL=script.js.map