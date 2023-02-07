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
const parchment_1 = require("parchment");
const emitter_1 = __importDefault(require("../core/emitter"));
const block_1 = __importStar(require("./block"));
const break_1 = __importDefault(require("./break"));
const container_1 = __importDefault(require("./container"));
function isLine(blot) {
    return blot instanceof block_1.default || blot instanceof block_1.BlockEmbed;
}
function isUpdatable(blot) {
    return typeof blot.updateContent === 'function';
}
class Scroll extends parchment_1.ScrollBlot {
    constructor(registry, domNode, { emitter }) {
        super(registry, domNode);
        this.emitter = emitter;
        this.batch = false;
        this.optimize();
        this.enable();
        this.domNode.addEventListener('dragstart', e => this.handleDragStart(e));
    }
    batchStart() {
        if (!Array.isArray(this.batch)) {
            this.batch = [];
        }
    }
    batchEnd() {
        if (!this.batch)
            return;
        const mutations = this.batch;
        this.batch = false;
        this.update(mutations);
    }
    emitMount(blot) {
        this.emitter.emit(emitter_1.default.events.SCROLL_BLOT_MOUNT, blot);
    }
    emitUnmount(blot) {
        this.emitter.emit(emitter_1.default.events.SCROLL_BLOT_UNMOUNT, blot);
    }
    emitEmbedUpdate(blot, change) {
        this.emitter.emit(emitter_1.default.events.SCROLL_EMBED_UPDATE, blot, change);
    }
    deleteAt(index, length) {
        const [first, offset] = this.line(index);
        const [last] = this.line(index + length);
        super.deleteAt(index, length);
        if (last != null && first !== last && offset > 0) {
            if (first instanceof block_1.BlockEmbed || last instanceof block_1.BlockEmbed) {
                this.optimize();
                return;
            }
            const ref = last.children.head instanceof break_1.default ? null : last.children.head;
            first.moveChildren(last, ref);
            first.remove();
        }
        this.optimize();
    }
    enable(enabled = true) {
        this.domNode.setAttribute('contenteditable', enabled ? 'true' : 'false');
    }
    formatAt(index, length, format, value) {
        super.formatAt(index, length, format, value);
        this.optimize();
    }
    handleDragStart(event) {
        event.preventDefault();
    }
    insertAt(index, value, def) {
        if (index >= this.length()) {
            if (def == null || this.scroll.query(value, parchment_1.Scope.BLOCK) == null) {
                const blot = this.scroll.create(this.statics.defaultChild.blotName);
                this.appendChild(blot);
                if (def == null && value.endsWith('\n')) {
                    blot.insertAt(0, value.slice(0, -1), def);
                }
                else {
                    blot.insertAt(0, value, def);
                }
            }
            else {
                const embed = this.scroll.create(value, def);
                this.appendChild(embed);
            }
        }
        else {
            super.insertAt(index, value, def);
        }
        this.optimize();
    }
    insertBefore(blot, ref) {
        if (blot.statics.scope === parchment_1.Scope.INLINE_BLOT) {
            const wrapper = this.scroll.create(this.statics.defaultChild.blotName);
            wrapper.appendChild(blot);
            super.insertBefore(wrapper, ref);
        }
        else {
            super.insertBefore(blot, ref);
        }
    }
    isEnabled() {
        return this.domNode.getAttribute('contenteditable') === 'true';
    }
    leaf(index) {
        const last = this.path(index).pop();
        if (!last) {
            return [null, -1];
        }
        const [blot, offset] = last;
        return blot instanceof parchment_1.LeafBlot ? [blot, offset] : [null, -1];
    }
    line(index) {
        if (index === this.length()) {
            return this.line(index - 1);
        }
        // @ts-expect-error TODO: make descendant() generic
        return this.descendant(isLine, index);
    }
    lines(index = 0, length = Number.MAX_VALUE) {
        const getLines = (blot, blotIndex, blotLength) => {
            let lines = [];
            let lengthLeft = blotLength;
            blot.children.forEachAt(blotIndex, blotLength, (child, childIndex, childLength) => {
                if (isLine(child)) {
                    lines.push(child);
                }
                else if (child instanceof parchment_1.ContainerBlot) {
                    lines = lines.concat(getLines(child, childIndex, lengthLeft));
                }
                lengthLeft -= childLength;
            });
            return lines;
        };
        return getLines(this, index, length);
    }
    optimize(mutations = [], context = {}) {
        if (this.batch)
            return;
        super.optimize(mutations, context);
        if (mutations.length > 0) {
            this.emitter.emit(emitter_1.default.events.SCROLL_OPTIMIZE, mutations, context);
        }
    }
    path(index) {
        return super.path(index).slice(1); // Exclude self
    }
    remove() {
        // Never remove self
    }
    update(mutations) {
        if (this.batch) {
            if (Array.isArray(mutations)) {
                this.batch = this.batch.concat(mutations);
            }
            return;
        }
        let source = emitter_1.default.sources.USER;
        if (typeof mutations === 'string') {
            source = mutations;
        }
        if (!Array.isArray(mutations)) {
            mutations = this.observer.takeRecords();
        }
        mutations = mutations.filter(({ target }) => {
            const blot = this.find(target, true);
            return blot && !isUpdatable(blot);
        });
        if (mutations.length > 0) {
            this.emitter.emit(emitter_1.default.events.SCROLL_BEFORE_UPDATE, source, mutations);
        }
        super.update(mutations.concat([])); // pass copy
        if (mutations.length > 0) {
            this.emitter.emit(emitter_1.default.events.SCROLL_UPDATE, source, mutations);
        }
    }
    updateEmbedAt(index, key, change) {
        // Currently it only supports top-level embeds (BlockEmbed).
        // We can update `ParentBlot` in parchment to support inline embeds.
        const [blot] = this.descendant(b => b instanceof block_1.BlockEmbed, index);
        if (blot && blot.statics.blotName === key && isUpdatable(blot)) {
            blot.updateContent(change);
        }
    }
}
Scroll.blotName = 'scroll';
Scroll.className = 'ql-editor';
Scroll.tagName = 'DIV';
Scroll.defaultChild = block_1.default;
Scroll.allowedChildren = [block_1.default, block_1.BlockEmbed, container_1.default];
exports.default = Scroll;
//# sourceMappingURL=scroll.js.map