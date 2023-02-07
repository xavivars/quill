"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rfdc_1 = require("rfdc");
const fast_deep_equal_1 = require("fast-deep-equal");
const lodash_merge_1 = require("lodash.merge");
const parchment_1 = require("parchment");
const quill_delta_1 = require("@reedsy/quill-delta");
const block_1 = require("../blots/block");
const break_1 = require("../blots/break");
const cursor_1 = require("../blots/cursor");
const text_1 = require("../blots/text");
const selection_1 = require("./selection");
const cloneDeep = (0, rfdc_1.default)();
const ASCII = /^[ -~]*$/;
class Editor {
    constructor(scroll) {
        this.scroll = scroll;
        this.delta = this.getDelta();
    }
    applyDelta(delta) {
        this.scroll.update();
        let scrollLength = this.scroll.length();
        this.scroll.batchStart();
        const normalizedDelta = normalizeDelta(delta);
        const deleteDelta = new quill_delta_1.default();
        const normalizedOps = splitOpLines(normalizedDelta.ops.slice());
        normalizedOps.reduce((index, op) => {
            const length = quill_delta_1.Op.length(op);
            let attributes = op.attributes || {};
            let addedNewline = false;
            if (op.insert != null) {
                deleteDelta.retain(length);
                if (typeof op.insert === 'string') {
                    const text = op.insert;
                    // @ts-expect-error TODO: Fix this the next time the file is edited.
                    addedNewline =
                        !text.endsWith('\n') &&
                            (scrollLength <= index ||
                                // @ts-expect-error
                                this.scroll.descendant(block_1.BlockEmbed, index)[0]);
                    this.scroll.insertAt(index, text);
                    const [line, offset] = this.scroll.line(index);
                    let formats = (0, lodash_merge_1.default)({}, (0, block_1.bubbleFormats)(line));
                    if (line instanceof block_1.default) {
                        // @ts-expect-error
                        const [leaf] = line.descendant(parchment_1.LeafBlot, offset);
                        formats = (0, lodash_merge_1.default)(formats, (0, block_1.bubbleFormats)(leaf));
                    }
                    attributes = quill_delta_1.AttributeMap.diff(formats, attributes) || {};
                }
                else if (typeof op.insert === 'object') {
                    const key = Object.keys(op.insert)[0]; // There should only be one key
                    if (key == null)
                        return index;
                    // @ts-expect-error TODO: Fix this the next time the file is edited.
                    addedNewline =
                        this.scroll.query(key, parchment_1.Scope.INLINE) != null &&
                            (scrollLength <= index ||
                                // @ts-expect-error
                                this.scroll.descendant(block_1.BlockEmbed, index)[0]);
                    this.scroll.insertAt(index, key, op.insert[key]);
                }
                scrollLength += length;
            }
            else {
                deleteDelta.push(op);
                if (op.retain !== null && typeof op.retain === 'object') {
                    const key = Object.keys(op.retain)[0];
                    if (key == null)
                        return index;
                    this.scroll.updateEmbedAt(index, key, op.retain[key]);
                }
            }
            Object.keys(attributes).forEach(name => {
                this.scroll.formatAt(index, length, name, attributes[name]);
            });
            const addedLength = addedNewline ? 1 : 0;
            scrollLength += addedLength;
            deleteDelta.delete(addedLength);
            return index + length + addedLength;
        }, 0);
        deleteDelta.reduce((index, op) => {
            if (typeof op.delete === 'number') {
                this.scroll.deleteAt(index, op.delete);
                return index;
            }
            return index + quill_delta_1.Op.length(op);
        }, 0);
        this.scroll.batchEnd();
        this.scroll.optimize();
        return this.update(normalizedDelta);
    }
    deleteText(index, length) {
        this.scroll.deleteAt(index, length);
        return this.update(new quill_delta_1.default().retain(index).delete(length));
    }
    formatLine(index, length, formats = {}) {
        this.scroll.update();
        Object.keys(formats).forEach(format => {
            this.scroll.lines(index, Math.max(length, 1)).forEach(line => {
                line.format(format, formats[format]);
            });
        });
        this.scroll.optimize();
        const delta = new quill_delta_1.default().retain(index).retain(length, cloneDeep(formats));
        return this.update(delta);
    }
    formatText(index, length, formats = {}) {
        Object.keys(formats).forEach(format => {
            this.scroll.formatAt(index, length, format, formats[format]);
        });
        const delta = new quill_delta_1.default().retain(index).retain(length, cloneDeep(formats));
        return this.update(delta);
    }
    getContents(index, length) {
        return this.delta.slice(index, index + length);
    }
    getDelta() {
        return this.scroll.lines().reduce((delta, line) => {
            return delta.concat(line.delta());
        }, new quill_delta_1.default());
    }
    getFormat(index, length = 0) {
        let lines = [];
        let leaves = [];
        if (length === 0) {
            this.scroll.path(index).forEach(path => {
                const [blot] = path;
                if (blot instanceof block_1.default) {
                    lines.push(blot);
                }
                else if (blot instanceof parchment_1.LeafBlot) {
                    leaves.push(blot);
                }
            });
        }
        else {
            lines = this.scroll.lines(index, length);
            // @ts-expect-error
            leaves = this.scroll.descendants(parchment_1.LeafBlot, index, length);
        }
        [lines, leaves] = [lines, leaves].map(blots => {
            if (blots.length === 0)
                return {};
            let formats = (0, block_1.bubbleFormats)(blots.shift());
            while (Object.keys(formats).length > 0) {
                const blot = blots.shift();
                if (blot == null)
                    return formats;
                formats = combineFormats((0, block_1.bubbleFormats)(blot), formats);
            }
            return formats;
        });
        return Object.assign(Object.assign({}, lines), leaves);
    }
    getHTML(index, length) {
        const [line, lineOffset] = this.scroll.line(index);
        if (line.length() >= lineOffset + length) {
            return convertHTML(line, lineOffset, length, true);
        }
        return convertHTML(this.scroll, index, length, true);
    }
    getText(index, length) {
        return this.getContents(index, length)
            .filter(op => typeof op.insert === 'string')
            .map(op => op.insert)
            .join('');
    }
    insertEmbed(index, embed, value) {
        this.scroll.insertAt(index, embed, value);
        return this.update(new quill_delta_1.default().retain(index).insert({ [embed]: value }));
    }
    insertText(index, text, formats = {}) {
        text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        this.scroll.insertAt(index, text);
        Object.keys(formats).forEach(format => {
            this.scroll.formatAt(index, text.length, format, formats[format]);
        });
        return this.update(new quill_delta_1.default().retain(index).insert(text, cloneDeep(formats)));
    }
    isBlank() {
        if (this.scroll.children.length === 0)
            return true;
        if (this.scroll.children.length > 1)
            return false;
        const blot = this.scroll.children.head;
        if (blot.statics.blotName !== block_1.default.blotName)
            return false;
        const block = blot;
        if (block.children.length > 1)
            return false;
        return block.children.head instanceof break_1.default;
    }
    removeFormat(index, length) {
        const text = this.getText(index, length);
        const [line, offset] = this.scroll.line(index + length);
        let suffixLength = 0;
        let suffix = new quill_delta_1.default();
        if (line != null) {
            suffixLength = line.length() - offset;
            suffix = line
                .delta()
                .slice(offset, offset + suffixLength - 1)
                .insert('\n');
        }
        const contents = this.getContents(index, length + suffixLength);
        const diff = contents.diff(new quill_delta_1.default().insert(text).concat(suffix));
        const delta = new quill_delta_1.default().retain(index).concat(diff);
        return this.applyDelta(delta);
    }
    update(change, mutations = [], selectionInfo = undefined) {
        const oldDelta = this.delta;
        if (mutations.length === 1 &&
            mutations[0].type === 'characterData' &&
            mutations[0].target.data.match(ASCII) &&
            this.scroll.find(mutations[0].target)) {
            // Optimization for character changes
            const textBlot = this.scroll.find(mutations[0].target);
            const formats = (0, block_1.bubbleFormats)(textBlot);
            const index = textBlot.offset(this.scroll);
            const oldValue = mutations[0].oldValue.replace(cursor_1.default.CONTENTS, '');
            const oldText = new quill_delta_1.default().insert(oldValue);
            // @ts-expect-error
            const newText = new quill_delta_1.default().insert(textBlot.value());
            const relativeSelectionInfo = selectionInfo && {
                oldRange: shiftRange(selectionInfo.oldRange, -index),
                newRange: shiftRange(selectionInfo.newRange, -index),
            };
            const diffDelta = new quill_delta_1.default()
                .retain(index)
                .concat(oldText.diff(newText, relativeSelectionInfo));
            change = diffDelta.reduce((delta, op) => {
                if (op.insert) {
                    return delta.insert(op.insert, formats);
                }
                return delta.push(op);
            }, new quill_delta_1.default());
            this.delta = oldDelta.compose(change);
        }
        else {
            this.delta = this.getDelta();
            if (!change || !(0, fast_deep_equal_1.default)(oldDelta.compose(change), this.delta)) {
                change = oldDelta.diff(this.delta, selectionInfo);
            }
        }
        return change;
    }
}
function convertListHTML(items, lastIndent, types) {
    if (items.length === 0) {
        const [endTag] = getListType(types.pop());
        if (lastIndent <= 0) {
            return `</li></${endTag}>`;
        }
        return `</li></${endTag}>${convertListHTML([], lastIndent - 1, types)}`;
    }
    const [{ child, offset, length, indent, type }, ...rest] = items;
    const [tag, attribute] = getListType(type);
    if (indent > lastIndent) {
        types.push(type);
        if (indent === lastIndent + 1) {
            return `<${tag}><li${attribute}>${convertHTML(child, offset, length)}${convertListHTML(rest, indent, types)}`;
        }
        return `<${tag}><li>${convertListHTML(items, lastIndent + 1, types)}`;
    }
    const previousType = types[types.length - 1];
    if (indent === lastIndent && type === previousType) {
        return `</li><li${attribute}>${convertHTML(child, offset, length)}${convertListHTML(rest, indent, types)}`;
    }
    const [endTag] = getListType(types.pop());
    return `</li></${endTag}>${convertListHTML(items, lastIndent - 1, types)}`;
}
function convertHTML(blot, index, length, isRoot = false) {
    if (typeof blot.html === 'function') {
        return blot.html(index, length);
    }
    if (blot instanceof text_1.default) {
        return (0, text_1.escapeText)(blot.value().slice(index, index + length));
    }
    if (blot.children) {
        // TODO fix API
        if (blot.statics.blotName === 'list-container') {
            const items = [];
            blot.children.forEachAt(index, length, (child, offset, childLength) => {
                const formats = child.formats();
                items.push({
                    child,
                    offset,
                    length: childLength,
                    indent: formats.indent || 0,
                    type: formats.list,
                });
            });
            return convertListHTML(items, -1, []);
        }
        const parts = [];
        blot.children.forEachAt(index, length, (child, offset, childLength) => {
            parts.push(convertHTML(child, offset, childLength));
        });
        if (isRoot || blot.statics.blotName === 'list') {
            return parts.join('');
        }
        const { outerHTML, innerHTML } = blot.domNode;
        const [start, end] = outerHTML.split(`>${innerHTML}<`);
        // TODO cleanup
        if (start === '<table') {
            return `<table style="border: 1px solid #000;">${parts.join('')}<${end}`;
        }
        return `${start}>${parts.join('')}<${end}`;
    }
    return blot.domNode.outerHTML;
}
function combineFormats(formats, combined) {
    return Object.keys(combined).reduce((merged, name) => {
        if (formats[name] == null)
            return merged;
        if (combined[name] === formats[name]) {
            merged[name] = combined[name];
        }
        else if (Array.isArray(combined[name])) {
            if (combined[name].indexOf(formats[name]) < 0) {
                merged[name] = combined[name].concat([formats[name]]);
            }
            else {
                // If style already exists, don't add to an array, but don't lose other styles
                merged[name] = combined[name];
            }
        }
        else {
            merged[name] = [combined[name], formats[name]];
        }
        return merged;
    }, {});
}
function getListType(type) {
    const tag = type === 'ordered' ? 'ol' : 'ul';
    switch (type) {
        case 'checked':
            return [tag, ' data-list="checked"'];
        case 'unchecked':
            return [tag, ' data-list="unchecked"'];
        default:
            return [tag, ''];
    }
}
function normalizeDelta(delta) {
    return delta.reduce((normalizedDelta, op) => {
        if (typeof op.insert === 'string') {
            const text = op.insert.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
            return normalizedDelta.insert(text, op.attributes);
        }
        return normalizedDelta.push(op);
    }, new quill_delta_1.default());
}
function shiftRange({ index, length }, amount) {
    return new selection_1.Range(index + amount, length);
}
function splitOpLines(ops) {
    const split = [];
    ops.forEach(op => {
        if (typeof op.insert === 'string') {
            op.insert.split('\n').forEach((line, index) => {
                if (index) {
                    split.push({ insert: '\n', attributes: op.attributes });
                }
                split.push({ insert: line, attributes: op.attributes });
            });
        }
        else {
            split.push(op);
        }
    });
    return split;
}
exports.default = Editor;
//# sourceMappingURL=editor.js.map