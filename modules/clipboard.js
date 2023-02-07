"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.traverse = exports.matchText = exports.matchNewline = exports.matchBlot = exports.matchAttributor = exports.default = void 0;
const parchment_1 = require("parchment");
const quill_delta_1 = __importDefault(require("@reedsy/quill-delta"));
const block_1 = require("../blots/block");
const logger_1 = __importDefault(require("../core/logger"));
const module_1 = __importDefault(require("../core/module"));
const quill_1 = __importDefault(require("../core/quill"));
const align_1 = require("../formats/align");
const background_1 = require("../formats/background");
const code_1 = __importDefault(require("../formats/code"));
const color_1 = require("../formats/color");
const direction_1 = require("../formats/direction");
const font_1 = require("../formats/font");
const size_1 = require("../formats/size");
const keyboard_1 = require("./keyboard");
const debug = (0, logger_1.default)('quill:clipboard');
const CLIPBOARD_CONFIG = [
    [Node.TEXT_NODE, matchText],
    [Node.TEXT_NODE, matchNewline],
    ['br', matchBreak],
    [Node.ELEMENT_NODE, matchNewline],
    [Node.ELEMENT_NODE, matchBlot],
    [Node.ELEMENT_NODE, matchAttributor],
    [Node.ELEMENT_NODE, matchStyles],
    ['li', matchIndent],
    ['ol, ul', matchList],
    ['pre', matchCodeBlock],
    ['tr', matchTable],
    ['b', matchAlias.bind(matchAlias, 'bold')],
    ['i', matchAlias.bind(matchAlias, 'italic')],
    ['strike', matchAlias.bind(matchAlias, 'strike')],
    ['style', matchIgnore],
];
const ATTRIBUTE_ATTRIBUTORS = [align_1.AlignAttribute, direction_1.DirectionAttribute].reduce((memo, attr) => {
    memo[attr.keyName] = attr;
    return memo;
}, {});
const STYLE_ATTRIBUTORS = [
    align_1.AlignStyle,
    background_1.BackgroundStyle,
    color_1.ColorStyle,
    direction_1.DirectionStyle,
    font_1.FontStyle,
    size_1.SizeStyle,
].reduce((memo, attr) => {
    memo[attr.keyName] = attr;
    return memo;
}, {});
class Clipboard extends module_1.default {
    constructor(quill, options) {
        super(quill, options);
        this.quill.root.addEventListener('copy', e => this.onCaptureCopy(e, false));
        this.quill.root.addEventListener('cut', e => this.onCaptureCopy(e, true));
        this.quill.root.addEventListener('paste', this.onCapturePaste.bind(this));
        this.matchers = [];
        CLIPBOARD_CONFIG.concat(this.options.matchers).forEach(([selector, matcher]) => {
            this.addMatcher(selector, matcher);
        });
    }
    addMatcher(selector, matcher) {
        this.matchers.push([selector, matcher]);
    }
    convert({ html, text }, formats = {}) {
        if (formats[code_1.default.blotName]) {
            return new quill_delta_1.default().insert(text, {
                [code_1.default.blotName]: formats[code_1.default.blotName],
            });
        }
        if (!html) {
            html = (text || '')
                .split('\n')
                .map(line => `<p>${line}</p>`)
                .join('');
        }
        const delta = this.convertHTML(html);
        // Remove trailing newline
        if (deltaEndsWith(delta, '\n') &&
            (delta.ops[delta.ops.length - 1].attributes == null || formats.table)) {
            return delta.compose(new quill_delta_1.default().retain(delta.length() - 1).delete(1));
        }
        return delta;
    }
    convertHTML(html) {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const container = doc.body;
        const nodeMatches = new WeakMap();
        const [elementMatchers, textMatchers] = this.prepareMatching(container, nodeMatches);
        return traverse(this.quill.scroll, container, elementMatchers, textMatchers, nodeMatches);
    }
    dangerouslyPasteHTML(index, html, source = quill_1.default.sources.API) {
        if (typeof index === 'string') {
            const delta = this.convert({ html: index, text: '' });
            // @ts-expect-error
            this.quill.setContents(delta, html);
            this.quill.setSelection(0, quill_1.default.sources.SILENT);
        }
        else {
            const paste = this.convert({ html, text: '' });
            this.quill.updateContents(new quill_delta_1.default().retain(index).concat(paste), source);
            this.quill.setSelection(index + paste.length(), quill_1.default.sources.SILENT);
        }
    }
    onCaptureCopy(e, isCut = false) {
        if (e.defaultPrevented)
            return;
        e.preventDefault();
        const [range] = this.quill.selection.getRange();
        if (range == null)
            return;
        const { html, text } = this.onCopy(range, isCut);
        e.clipboardData.setData('text/plain', text);
        e.clipboardData.setData('text/html', html);
        if (isCut) {
            (0, keyboard_1.deleteRange)({ range, quill: this.quill });
        }
    }
    onCapturePaste(e) {
        if (e.defaultPrevented || !this.quill.isEnabled())
            return;
        e.preventDefault();
        const range = this.quill.getSelection(true);
        if (range == null)
            return;
        const html = e.clipboardData.getData('text/html');
        const text = e.clipboardData.getData('text/plain');
        const files = Array.from(e.clipboardData.files || []);
        if (!html && files.length > 0) {
            this.quill.uploader.upload(range, files);
            return;
        }
        if (html && files.length > 0) {
            const doc = new DOMParser().parseFromString(html, 'text/html');
            if (doc.body.childElementCount === 1 &&
                doc.body.firstElementChild.tagName === 'IMG') {
                this.quill.uploader.upload(range, files);
                return;
            }
        }
        this.onPaste(range, { html, text });
    }
    onCopy(range) {
        const text = this.quill.getText(range);
        const html = this.quill.getSemanticHTML(range);
        return { html, text };
    }
    onPaste(range, { text, html }) {
        const formats = this.quill.getFormat(range.index);
        const pastedDelta = this.convert({ text, html }, formats);
        debug.log('onPaste', pastedDelta, { text, html });
        const delta = new quill_delta_1.default()
            .retain(range.index)
            .delete(range.length)
            .concat(pastedDelta);
        this.quill.updateContents(delta, quill_1.default.sources.USER);
        // range.length contributes to delta.length()
        this.quill.setSelection(delta.length() - range.length, quill_1.default.sources.SILENT);
        this.quill.scrollIntoView();
    }
    prepareMatching(container, nodeMatches) {
        const elementMatchers = [];
        const textMatchers = [];
        this.matchers.forEach(pair => {
            const [selector, matcher] = pair;
            switch (selector) {
                case Node.TEXT_NODE:
                    textMatchers.push(matcher);
                    break;
                case Node.ELEMENT_NODE:
                    elementMatchers.push(matcher);
                    break;
                default:
                    // @ts-expect-error
                    Array.from(container.querySelectorAll(selector)).forEach(node => {
                        if (nodeMatches.has(node)) {
                            const matches = nodeMatches.get(node);
                            matches.push(matcher);
                        }
                        else {
                            nodeMatches.set(node, [matcher]);
                        }
                    });
                    break;
            }
        });
        return [elementMatchers, textMatchers];
    }
}
exports.default = Clipboard;
Clipboard.DEFAULTS = {
    matchers: [],
};
function applyFormat(delta, format, value) {
    if (typeof format === 'object') {
        return Object.keys(format).reduce((newDelta, key) => {
            return applyFormat(newDelta, key, format[key]);
        }, delta);
    }
    return delta.reduce((newDelta, op) => {
        if (op.attributes && op.attributes[format]) {
            return newDelta.push(op);
        }
        const formats = value ? { [format]: value } : {};
        return newDelta.insert(op.insert, Object.assign(Object.assign({}, formats), op.attributes));
    }, new quill_delta_1.default());
}
function deltaEndsWith(delta, text) {
    let endText = '';
    for (let i = delta.ops.length - 1; i >= 0 && endText.length < text.length; --i // eslint-disable-line no-plusplus
    ) {
        const op = delta.ops[i];
        if (typeof op.insert !== 'string')
            break;
        endText = op.insert + endText;
    }
    return endText.slice(-1 * text.length) === text;
}
function isLine(node, scroll) {
    if (node.nodeType !== Node.ELEMENT_NODE)
        return false;
    const match = scroll.query(node);
    if (match && match.prototype instanceof parchment_1.EmbedBlot)
        return false;
    return [
        'address',
        'article',
        'blockquote',
        'canvas',
        'dd',
        'div',
        'dl',
        'dt',
        'fieldset',
        'figcaption',
        'figure',
        'footer',
        'form',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'header',
        'iframe',
        'li',
        'main',
        'nav',
        'ol',
        'output',
        'p',
        'pre',
        'section',
        'table',
        'td',
        'tr',
        'ul',
        'video',
    ].includes(node.tagName.toLowerCase());
}
function isBetweenInlineElements(node, scroll) {
    return (node.previousSibling &&
        node.nextSibling &&
        !isLine(node.previousSibling, scroll) &&
        !isLine(node.nextSibling, scroll));
}
const preNodes = new WeakMap();
function isPre(node) {
    if (node == null)
        return false;
    if (!preNodes.has(node)) {
        // @ts-expect-error
        if (node.tagName === 'PRE') {
            preNodes.set(node, true);
        }
        else {
            preNodes.set(node, isPre(node.parentNode));
        }
    }
    return preNodes.get(node);
}
function traverse(scroll, node, elementMatchers, textMatchers, nodeMatches) {
    // Post-order
    if (node.nodeType === node.TEXT_NODE) {
        return textMatchers.reduce((delta, matcher) => {
            return matcher(node, delta, scroll);
        }, new quill_delta_1.default());
    }
    if (node.nodeType === node.ELEMENT_NODE) {
        return Array.from(node.childNodes || []).reduce((delta, childNode) => {
            let childrenDelta = traverse(scroll, childNode, elementMatchers, textMatchers, nodeMatches);
            if (childNode.nodeType === node.ELEMENT_NODE) {
                childrenDelta = elementMatchers.reduce((reducedDelta, matcher) => {
                    return matcher(childNode, reducedDelta, scroll);
                }, childrenDelta);
                childrenDelta = (nodeMatches.get(childNode) || []).reduce((reducedDelta, matcher) => {
                    return matcher(childNode, reducedDelta, scroll);
                }, childrenDelta);
            }
            return delta.concat(childrenDelta);
        }, new quill_delta_1.default());
    }
    return new quill_delta_1.default();
}
exports.traverse = traverse;
function matchAlias(format, node, delta) {
    return applyFormat(delta, format, true);
}
function matchAttributor(node, delta, scroll) {
    const attributes = parchment_1.Attributor.keys(node);
    const classes = parchment_1.ClassAttributor.keys(node);
    const styles = parchment_1.StyleAttributor.keys(node);
    const formats = {};
    attributes
        .concat(classes)
        .concat(styles)
        .forEach(name => {
        let attr = scroll.query(name, parchment_1.Scope.ATTRIBUTE);
        if (attr != null) {
            formats[attr.attrName] = attr.value(node);
            if (formats[attr.attrName])
                return;
        }
        attr = ATTRIBUTE_ATTRIBUTORS[name];
        if (attr != null && (attr.attrName === name || attr.keyName === name)) {
            formats[attr.attrName] = attr.value(node) || undefined;
        }
        attr = STYLE_ATTRIBUTORS[name];
        if (attr != null && (attr.attrName === name || attr.keyName === name)) {
            attr = STYLE_ATTRIBUTORS[name];
            formats[attr.attrName] = attr.value(node) || undefined;
        }
    });
    if (Object.keys(formats).length > 0) {
        return applyFormat(delta, formats);
    }
    return delta;
}
exports.matchAttributor = matchAttributor;
function matchBlot(node, delta, scroll) {
    const match = scroll.query(node);
    if (match == null)
        return delta;
    // @ts-expect-error
    if (match.prototype instanceof parchment_1.EmbedBlot) {
        const embed = {};
        // @ts-expect-error
        const value = match.value(node);
        if (value != null) {
            // @ts-expect-error
            embed[match.blotName] = value;
            // @ts-expect-error
            return new quill_delta_1.default().insert(embed, match.formats(node, scroll));
        }
    }
    else {
        // @ts-expect-error
        if (match.prototype instanceof parchment_1.BlockBlot && !deltaEndsWith(delta, '\n')) {
            delta.insert('\n');
        }
        // @ts-expect-error
        if (typeof match.formats === 'function') {
            // @ts-expect-error
            return applyFormat(delta, match.blotName, match.formats(node, scroll));
        }
    }
    return delta;
}
exports.matchBlot = matchBlot;
function matchBreak(node, delta) {
    if (!deltaEndsWith(delta, '\n')) {
        delta.insert('\n');
    }
    return delta;
}
function matchCodeBlock(node, delta, scroll) {
    const match = scroll.query('code-block');
    const language = match ? match.formats(node, scroll) : true;
    return applyFormat(delta, 'code-block', language);
}
function matchIgnore() {
    return new quill_delta_1.default();
}
function matchIndent(node, delta, scroll) {
    const match = scroll.query(node);
    if (match == null ||
        // @ts-expect-error
        match.blotName !== 'list' ||
        !deltaEndsWith(delta, '\n')) {
        return delta;
    }
    let indent = -1;
    let parent = node.parentNode;
    while (parent != null) {
        // @ts-expect-error
        if (['OL', 'UL'].includes(parent.tagName)) {
            indent += 1;
        }
        parent = parent.parentNode;
    }
    if (indent <= 0)
        return delta;
    return delta.reduce((composed, op) => {
        if (op.attributes && typeof op.attributes.indent === 'number') {
            return composed.push(op);
        }
        return composed.insert(op.insert, Object.assign({ indent }, (op.attributes || {})));
    }, new quill_delta_1.default());
}
function matchList(node, delta) {
    // @ts-expect-error
    const list = node.tagName === 'OL' ? 'ordered' : 'bullet';
    return applyFormat(delta, 'list', list);
}
function matchNewline(node, delta, scroll) {
    if (!deltaEndsWith(delta, '\n')) {
        // @ts-expect-error
        if (isLine(node, scroll)) {
            return delta.insert('\n');
        }
        if (delta.length() > 0 && node.nextSibling) {
            let { nextSibling } = node;
            while (nextSibling != null) {
                // @ts-expect-error
                if (isLine(nextSibling, scroll)) {
                    return delta.insert('\n');
                }
                const match = scroll.query(nextSibling);
                // @ts-expect-error
                if (match && match.prototype instanceof block_1.BlockEmbed) {
                    return delta.insert('\n');
                }
                nextSibling = nextSibling.firstChild;
            }
        }
    }
    return delta;
}
exports.matchNewline = matchNewline;
function matchStyles(node, delta) {
    const formats = {};
    const style = node.style || {};
    if (style.fontStyle === 'italic') {
        formats.italic = true;
    }
    if (style.textDecoration === 'underline') {
        formats.underline = true;
    }
    if (style.textDecoration === 'line-through') {
        formats.strike = true;
    }
    if (style.fontWeight.startsWith('bold') ||
        parseInt(style.fontWeight, 10) >= 700) {
        formats.bold = true;
    }
    if (Object.keys(formats).length > 0) {
        delta = applyFormat(delta, formats);
    }
    // @ts-expect-error
    if (parseFloat(style.textIndent || 0) > 0) {
        // Could be 0.5in
        return new quill_delta_1.default().insert('\t').concat(delta);
    }
    return delta;
}
function matchTable(node, delta) {
    const table = node.parentNode.tagName === 'TABLE'
        ? node.parentNode
        : node.parentNode.parentNode;
    const rows = Array.from(table.querySelectorAll('tr'));
    const row = rows.indexOf(node) + 1;
    return applyFormat(delta, 'table', row);
}
function matchText(node, delta, scroll) {
    let text = node.data;
    // Word represents empty line with <o:p>&nbsp;</o:p>
    if (node.parentNode.tagName === 'O:P') {
        return delta.insert(text.trim());
    }
    if (!isPre(node)) {
        if (text.trim().length === 0 &&
            text.includes('\n') &&
            !isBetweenInlineElements(node, scroll)) {
            return delta;
        }
        const replacer = (collapse, match) => {
            const replaced = match.replace(/[^\u00a0]/g, ''); // \u00a0 is nbsp;
            return replaced.length < 1 && collapse ? ' ' : replaced;
        };
        text = text.replace(/\r\n/g, ' ').replace(/\n/g, ' ');
        text = text.replace(/\s\s+/g, replacer.bind(replacer, true)); // collapse whitespace
        if ((node.previousSibling == null && isLine(node.parentNode, scroll)) ||
            (node.previousSibling != null && isLine(node.previousSibling, scroll))) {
            text = text.replace(/^\s+/, replacer.bind(replacer, false));
        }
        if ((node.nextSibling == null && isLine(node.parentNode, scroll)) ||
            (node.nextSibling != null && isLine(node.nextSibling, scroll))) {
            text = text.replace(/\s+$/, replacer.bind(replacer, false));
        }
    }
    return delta.insert(text);
}
exports.matchText = matchText;
//# sourceMappingURL=clipboard.js.map