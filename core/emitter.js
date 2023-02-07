"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const eventemitter3_1 = __importDefault(require("eventemitter3"));
const instances_1 = __importDefault(require("./instances"));
const logger_1 = __importDefault(require("./logger"));
const debug = (0, logger_1.default)('quill:events');
const EVENTS = ['selectionchange', 'mousedown', 'mouseup', 'click'];
EVENTS.forEach(eventName => {
    document.addEventListener(eventName, (...args) => {
        Array.from(document.querySelectorAll('.ql-container')).forEach(node => {
            const quill = instances_1.default.get(node);
            if (quill && quill.emitter) {
                quill.emitter.handleDOM(...args);
            }
        });
    });
});
class Emitter extends eventemitter3_1.default {
    constructor() {
        super();
        this.listeners = {};
        this.on('error', debug.error);
    }
    emit(...args) {
        debug.log.call(debug, ...args);
        // @ts-expect-error
        return super.emit(...args);
    }
    handleDOM(event, ...args) {
        (this.listeners[event.type] || []).forEach(({ node, handler }) => {
            if (event.target === node || node.contains(event.target)) {
                handler(event, ...args);
            }
        });
    }
    listenDOM(eventName, node, handler) {
        if (!this.listeners[eventName]) {
            this.listeners[eventName] = [];
        }
        this.listeners[eventName].push({ node, handler });
    }
}
Emitter.events = {
    EDITOR_CHANGE: 'editor-change',
    SCROLL_BEFORE_UPDATE: 'scroll-before-update',
    SCROLL_BLOT_MOUNT: 'scroll-blot-mount',
    SCROLL_BLOT_UNMOUNT: 'scroll-blot-unmount',
    SCROLL_OPTIMIZE: 'scroll-optimize',
    SCROLL_UPDATE: 'scroll-update',
    SCROLL_EMBED_UPDATE: 'scroll-embed-update',
    SELECTION_CHANGE: 'selection-change',
    TEXT_CHANGE: 'text-change',
};
Emitter.sources = {
    API: 'api',
    SILENT: 'silent',
    USER: 'user',
};
exports.default = Emitter;
//# sourceMappingURL=emitter.js.map