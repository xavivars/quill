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
exports.default = exports.CodeToken = exports.CodeBlock = void 0;
const quill_delta_1 = __importDefault(require("@reedsy/quill-delta"));
const parchment_1 = require("parchment");
const inline_1 = __importDefault(require("../blots/inline"));
const quill_1 = __importDefault(require("../core/quill"));
const module_1 = __importDefault(require("../core/module"));
const block_1 = require("../blots/block");
const break_1 = __importDefault(require("../blots/break"));
const cursor_1 = __importDefault(require("../blots/cursor"));
const text_1 = __importStar(require("../blots/text"));
const code_1 = __importStar(require("../formats/code"));
const clipboard_1 = require("./clipboard");
const TokenAttributor = new parchment_1.ClassAttributor('code-token', 'hljs', {
    scope: parchment_1.Scope.INLINE,
});
class CodeToken extends inline_1.default {
    static formats(node, scroll) {
        while (node != null && node !== scroll.domNode) {
            if (node.classList && node.classList.contains(code_1.default.className)) {
                // @ts-expect-error
                return super.formats(node, scroll);
            }
            // @ts-expect-error
            node = node.parentNode;
        }
        return undefined;
    }
    constructor(scroll, domNode, value) {
        // @ts-expect-error
        super(scroll, domNode, value);
        // @ts-expect-error
        TokenAttributor.add(this.domNode, value);
    }
    format(format, value) {
        if (format !== CodeToken.blotName) {
            super.format(format, value);
        }
        else if (value) {
            // @ts-expect-error
            TokenAttributor.add(this.domNode, value);
        }
        else {
            TokenAttributor.remove(this.domNode);
            this.domNode.classList.remove(this.statics.className);
        }
    }
    optimize(...args) {
        // @ts-expect-error
        super.optimize(...args);
        if (!TokenAttributor.value(this.domNode)) {
            this.unwrap();
        }
    }
}
exports.CodeToken = CodeToken;
CodeToken.blotName = 'code-token';
CodeToken.className = 'ql-token';
class SyntaxCodeBlock extends code_1.default {
    static create(value) {
        const domNode = super.create(value);
        if (typeof value === 'string') {
            // @ts-expect-error
            domNode.setAttribute('data-language', value);
        }
        return domNode;
    }
    static formats(domNode) {
        // @ts-expect-error
        return domNode.getAttribute('data-language') || 'plain';
    }
    static register() { } // Syntax module will register
    format(name, value) {
        if (name === this.statics.blotName && value) {
            // @ts-expect-error
            this.domNode.setAttribute('data-language', value);
        }
        else {
            super.format(name, value);
        }
    }
    replaceWith(name, value) {
        this.formatAt(0, this.length(), CodeToken.blotName, false);
        return super.replaceWith(name, value);
    }
}
exports.CodeBlock = SyntaxCodeBlock;
class SyntaxCodeBlockContainer extends code_1.CodeBlockContainer {
    attach() {
        super.attach();
        this.forceNext = false;
        // @ts-expect-error
        this.scroll.emitMount(this);
    }
    format(name, value) {
        if (name === SyntaxCodeBlock.blotName) {
            this.forceNext = true;
            this.children.forEach(child => {
                // @ts-expect-error
                child.format(name, value);
            });
        }
    }
    formatAt(index, length, name, value) {
        if (name === SyntaxCodeBlock.blotName) {
            this.forceNext = true;
        }
        super.formatAt(index, length, name, value);
    }
    highlight(highlight, forced = false) {
        if (this.children.head == null)
            return;
        const nodes = Array.from(this.domNode.childNodes).filter(node => node !== this.uiNode);
        const text = `${nodes.map(node => node.textContent).join('\n')}\n`;
        const language = SyntaxCodeBlock.formats(this.children.head.domNode);
        if (forced || this.forceNext || this.cachedText !== text) {
            if (text.trim().length > 0 || this.cachedText == null) {
                const oldDelta = this.children.reduce((delta, child) => {
                    // @ts-expect-error
                    return delta.concat((0, block_1.blockDelta)(child, false));
                }, new quill_delta_1.default());
                const delta = highlight(text, language);
                oldDelta.diff(delta).reduce((index, { retain, attributes }) => {
                    // Should be all retains
                    if (!retain)
                        return index;
                    if (attributes) {
                        Object.keys(attributes).forEach(format => {
                            if ([SyntaxCodeBlock.blotName, CodeToken.blotName].includes(format)) {
                                // @ts-expect-error
                                this.formatAt(index, retain, format, attributes[format]);
                            }
                        });
                    }
                    // @ts-expect-error
                    return index + retain;
                }, 0);
            }
            this.cachedText = text;
            this.forceNext = false;
        }
    }
    html(index, length) {
        const [codeBlock] = this.children.find(index);
        const language = codeBlock
            ? SyntaxCodeBlock.formats(codeBlock.domNode)
            : 'plain';
        return `<pre data-language="${language}">\n${(0, text_1.escapeText)(this.code(index, length))}\n</pre>`;
    }
    optimize(context) {
        super.optimize(context);
        if (this.parent != null &&
            this.children.head != null &&
            this.uiNode != null) {
            const language = SyntaxCodeBlock.formats(this.children.head.domNode);
            // @ts-expect-error
            if (language !== this.uiNode.value) {
                // @ts-expect-error
                this.uiNode.value = language;
            }
        }
    }
}
// @ts-expect-error
SyntaxCodeBlockContainer.allowedChildren = [SyntaxCodeBlock];
SyntaxCodeBlock.requiredContainer = SyntaxCodeBlockContainer;
SyntaxCodeBlock.allowedChildren = [CodeToken, cursor_1.default, text_1.default, break_1.default];
class Syntax extends module_1.default {
    constructor(quill, options) {
        super(quill, options);
        // @ts-expect-error
        if (this.options.hljs == null) {
            throw new Error('Syntax module requires highlight.js. Please include the library on the page before Quill.');
        }
        this.languages = this.options.languages.reduce((memo, { key }) => {
            memo[key] = true;
            return memo;
        }, {});
        this.highlightBlot = this.highlightBlot.bind(this);
        this.initListener();
        this.initTimer();
    }
    static register() {
        quill_1.default.register(CodeToken, true);
        // @ts-expect-error
        quill_1.default.register(SyntaxCodeBlock, true);
        quill_1.default.register(SyntaxCodeBlockContainer, true);
    }
    initListener() {
        this.quill.on(quill_1.default.events.SCROLL_BLOT_MOUNT, blot => {
            if (!(blot instanceof SyntaxCodeBlockContainer))
                return;
            const select = this.quill.root.ownerDocument.createElement('select');
            this.options.languages.forEach(({ key, label }) => {
                const option = select.ownerDocument.createElement('option');
                option.textContent = label;
                option.setAttribute('value', key);
                select.appendChild(option);
            });
            select.addEventListener('change', () => {
                blot.format(SyntaxCodeBlock.blotName, select.value);
                this.quill.root.focus(); // Prevent scrolling
                this.highlight(blot, true);
            });
            if (blot.uiNode == null) {
                blot.attachUI(select);
                if (blot.children.head) {
                    select.value = SyntaxCodeBlock.formats(blot.children.head.domNode);
                }
            }
        });
    }
    initTimer() {
        let timer = null;
        this.quill.on(quill_1.default.events.SCROLL_OPTIMIZE, () => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                this.highlight();
                timer = null;
            }, this.options.interval);
        });
    }
    highlight(blot = null, force = false) {
        if (this.quill.selection.composing)
            return;
        this.quill.update(quill_1.default.sources.USER);
        const range = this.quill.getSelection();
        const blots = blot == null
            ? // @ts-expect-error
                this.quill.scroll.descendants(SyntaxCodeBlockContainer)
            : [blot];
        blots.forEach(container => {
            container.highlight(this.highlightBlot, force);
        });
        this.quill.update(quill_1.default.sources.SILENT);
        if (range != null) {
            this.quill.setSelection(range, quill_1.default.sources.SILENT);
        }
    }
    highlightBlot(text, language = 'plain') {
        language = this.languages[language] ? language : 'plain';
        if (language === 'plain') {
            return (0, text_1.escapeText)(text)
                .split('\n')
                .reduce((delta, line, i) => {
                if (i !== 0) {
                    delta.insert('\n', { [code_1.default.blotName]: language });
                }
                return delta.insert(line);
            }, new quill_delta_1.default());
        }
        const container = this.quill.root.ownerDocument.createElement('div');
        container.classList.add(code_1.default.className);
        // @ts-expect-error
        container.innerHTML = this.options.hljs.highlight(language, text).value;
        return (0, clipboard_1.traverse)(this.quill.scroll, container, [
            (node, delta) => {
                // @ts-expect-error
                const value = TokenAttributor.value(node);
                if (value) {
                    return delta.compose(new quill_delta_1.default().retain(delta.length(), {
                        [CodeToken.blotName]: value,
                    }));
                }
                return delta;
            },
        ], [
            (node, delta) => {
                // @ts-expect-error
                return node.data.split('\n').reduce((memo, nodeText, i) => {
                    if (i !== 0)
                        memo.insert('\n', { [code_1.default.blotName]: language });
                    return memo.insert(nodeText);
                }, delta);
            },
        ], new WeakMap());
    }
}
exports.default = Syntax;
Syntax.DEFAULTS = {
    hljs: (() => {
        // @ts-expect-error
        return window.hljs;
    })(),
    interval: 1000,
    languages: [
        { key: 'plain', label: 'Plain' },
        { key: 'bash', label: 'Bash' },
        { key: 'cpp', label: 'C++' },
        { key: 'cs', label: 'C#' },
        { key: 'css', label: 'CSS' },
        { key: 'diff', label: 'Diff' },
        { key: 'xml', label: 'HTML/XML' },
        { key: 'java', label: 'Java' },
        { key: 'javascript', label: 'Javascript' },
        { key: 'markdown', label: 'Markdown' },
        { key: 'php', label: 'PHP' },
        { key: 'python', label: 'Python' },
        { key: 'ruby', label: 'Ruby' },
        { key: 'sql', label: 'SQL' },
    ],
};
//# sourceMappingURL=syntax.js.map