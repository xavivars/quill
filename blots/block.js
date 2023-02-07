"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exports.BlockEmbed = exports.bubbleFormats = exports.blockDelta = void 0;
const parchment_1 = require("parchment");
const quill_delta_1 = __importDefault(require("@reedsy/quill-delta"));
const break_1 = __importDefault(require("./break"));
const inline_1 = __importDefault(require("./inline"));
const text_1 = __importDefault(require("./text"));
const NEWLINE_LENGTH = 1;
class Block extends parchment_1.BlockBlot {
    constructor() {
        super(...arguments);
        this.cache = {};
    }
    delta() {
        if (this.cache.delta == null) {
            this.cache.delta = blockDelta(this);
        }
        return this.cache.delta;
    }
    deleteAt(index, length) {
        super.deleteAt(index, length);
        this.cache = {};
    }
    formatAt(index, length, name, value) {
        if (length <= 0)
            return;
        if (this.scroll.query(name, parchment_1.Scope.BLOCK)) {
            if (index + length === this.length()) {
                this.format(name, value);
            }
        }
        else {
            super.formatAt(index, Math.min(length, this.length() - index - 1), name, value);
        }
        this.cache = {};
    }
    insertAt(index, value, def) {
        if (def != null) {
            super.insertAt(index, value, def);
            this.cache = {};
            return;
        }
        if (value.length === 0)
            return;
        const lines = value.split('\n');
        const text = lines.shift();
        if (text.length > 0) {
            if (index < this.length() - 1 || this.children.tail == null) {
                super.insertAt(Math.min(index, this.length() - 1), text);
            }
            else {
                this.children.tail.insertAt(this.children.tail.length(), text);
            }
            this.cache = {};
        }
        // TODO: Fix this next time the file is edited.
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        let block = this;
        lines.reduce((lineIndex, line) => {
            block = block.split(lineIndex, true);
            block.insertAt(0, line);
            return line.length;
        }, index + text.length);
    }
    insertBefore(blot, ref) {
        const { head } = this.children;
        super.insertBefore(blot, ref);
        if (head instanceof break_1.default) {
            head.remove();
        }
        this.cache = {};
    }
    length() {
        if (this.cache.length == null) {
            this.cache.length = super.length() + NEWLINE_LENGTH;
        }
        return this.cache.length;
    }
    moveChildren(target, ref) {
        super.moveChildren(target, ref);
        this.cache = {};
    }
    optimize(context) {
        super.optimize(context);
        this.cache = {};
    }
    path(index) {
        return super.path(index, true);
    }
    removeChild(child) {
        super.removeChild(child);
        this.cache = {};
    }
    split(index, force = false) {
        if (force && (index === 0 || index >= this.length() - NEWLINE_LENGTH)) {
            const clone = this.clone();
            if (index === 0) {
                this.parent.insertBefore(clone, this);
                return this;
            }
            this.parent.insertBefore(clone, this.next);
            return clone;
        }
        const next = super.split(index, force);
        this.cache = {};
        return next;
    }
}
exports.default = Block;
Block.blotName = 'block';
Block.tagName = 'P';
Block.defaultChild = break_1.default;
Block.allowedChildren = [break_1.default, inline_1.default, parchment_1.EmbedBlot, text_1.default];
class BlockEmbed extends parchment_1.EmbedBlot {
    attach() {
        super.attach();
        this.attributes = new parchment_1.AttributorStore(this.domNode);
    }
    delta() {
        return new quill_delta_1.default().insert(this.value(), Object.assign(Object.assign({}, this.formats()), this.attributes.values()));
    }
    format(name, value) {
        const attribute = this.scroll.query(name, parchment_1.Scope.BLOCK_ATTRIBUTE);
        if (attribute != null) {
            // @ts-expect-error TODO: Scroll#query() should return Attributor when scope is attribute
            this.attributes.attribute(attribute, value);
        }
    }
    formatAt(index, length, name, value) {
        this.format(name, value);
    }
    insertAt(index, value, def) {
        if (typeof value === 'string' && value.endsWith('\n')) {
            const block = this.scroll.create(Block.blotName);
            this.parent.insertBefore(block, index === 0 ? this : this.next);
            block.insertAt(0, value.slice(0, -1));
        }
        else {
            super.insertAt(index, value, def);
        }
    }
}
exports.BlockEmbed = BlockEmbed;
BlockEmbed.scope = parchment_1.Scope.BLOCK_BLOT;
// It is important for cursor behavior BlockEmbeds use tags that are block level elements
function blockDelta(blot, filter = true) {
    return (blot
        // @ts-expect-error
        .descendants(parchment_1.LeafBlot)
        .reduce((delta, leaf) => {
        if (leaf.length() === 0) {
            return delta;
        }
        return delta.insert(leaf.value(), bubbleFormats(leaf, {}, filter));
    }, new quill_delta_1.default())
        .insert('\n', bubbleFormats(blot)));
}
exports.blockDelta = blockDelta;
function bubbleFormats(blot, formats = {}, filter = true) {
    if (blot == null)
        return formats;
    if (typeof blot.formats === 'function') {
        formats = Object.assign(Object.assign({}, formats), blot.formats());
        if (filter) {
            // exclude syntax highlighting from deltas and getFormat()
            delete formats['code-token'];
        }
    }
    if (blot.parent == null ||
        blot.parent.statics.blotName === 'scroll' ||
        blot.parent.statics.scope !== blot.statics.scope) {
        return formats;
    }
    return bubbleFormats(blot.parent, formats, filter);
}
exports.bubbleFormats = bubbleFormats;
//# sourceMappingURL=block.js.map