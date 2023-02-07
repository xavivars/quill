"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exports.CodeBlockContainer = exports.Code = void 0;
const block_1 = __importDefault(require("../blots/block"));
const break_1 = __importDefault(require("../blots/break"));
const cursor_1 = __importDefault(require("../blots/cursor"));
const inline_1 = __importDefault(require("../blots/inline"));
const text_1 = __importStar(require("../blots/text"));
const container_1 = __importDefault(require("../blots/container"));
const quill_1 = __importDefault(require("../core/quill"));
class CodeBlockContainer extends container_1.default {
    static create(value) {
        const domNode = super.create(value);
        domNode.setAttribute('spellcheck', 'false');
        return domNode;
    }
    code(index, length) {
        return (this.children
            // @ts-expect-error
            .map(child => (child.length() <= 1 ? '' : child.domNode.innerText))
            .join('\n')
            .slice(index, index + length));
    }
    html(index, length) {
        // `\n`s are needed in order to support empty lines at the beginning and the end.
        // https://html.spec.whatwg.org/multipage/syntax.html#element-restrictions
        return `<pre>\n${(0, text_1.escapeText)(this.code(index, length))}\n</pre>`;
    }
}
exports.CodeBlockContainer = CodeBlockContainer;
class CodeBlock extends block_1.default {
    static register() {
        quill_1.default.register(CodeBlockContainer);
    }
}
exports.default = CodeBlock;
CodeBlock.TAB = '  ';
class Code extends inline_1.default {
}
exports.Code = Code;
Code.blotName = 'code';
Code.tagName = 'CODE';
CodeBlock.blotName = 'code-block';
CodeBlock.className = 'ql-code-block';
CodeBlock.tagName = 'DIV';
CodeBlockContainer.blotName = 'code-block-container';
CodeBlockContainer.className = 'ql-code-block-container';
CodeBlockContainer.tagName = 'DIV';
CodeBlockContainer.allowedChildren = [CodeBlock];
CodeBlock.allowedChildren = [text_1.default, break_1.default, cursor_1.default];
CodeBlock.requiredContainer = CodeBlockContainer;
//# sourceMappingURL=code.js.map