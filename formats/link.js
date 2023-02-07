"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitize = exports.default = void 0;
const inline_1 = __importDefault(require("../blots/inline"));
class Link extends inline_1.default {
    static create(value) {
        const node = super.create(value);
        node.setAttribute('href', this.sanitize(value));
        node.setAttribute('rel', 'noopener noreferrer');
        node.setAttribute('target', '_blank');
        return node;
    }
    static formats(domNode) {
        return domNode.getAttribute('href');
    }
    static sanitize(url) {
        return sanitize(url, this.PROTOCOL_WHITELIST) ? url : this.SANITIZED_URL;
    }
    format(name, value) {
        if (name !== this.statics.blotName || !value) {
            super.format(name, value);
        }
        else {
            // @ts-expect-error
            this.domNode.setAttribute('href', this.constructor.sanitize(value));
        }
    }
}
exports.default = Link;
Link.blotName = 'link';
Link.tagName = 'A';
Link.SANITIZED_URL = 'about:blank';
Link.PROTOCOL_WHITELIST = ['http', 'https', 'mailto', 'tel', 'sms'];
function sanitize(url, protocols) {
    const anchor = document.createElement('a');
    anchor.href = url;
    const protocol = anchor.href.slice(0, anchor.href.indexOf(':'));
    return protocols.indexOf(protocol) > -1;
}
exports.sanitize = sanitize;
//# sourceMappingURL=link.js.map