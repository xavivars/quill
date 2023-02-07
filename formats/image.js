"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parchment_1 = require("parchment");
const link_1 = require("./link");
const ATTRIBUTES = ['alt', 'height', 'width'];
class Image extends parchment_1.EmbedBlot {
    static create(value) {
        const node = super.create(value);
        if (typeof value === 'string') {
            node.setAttribute('src', this.sanitize(value));
        }
        return node;
    }
    static formats(domNode) {
        return ATTRIBUTES.reduce((formats, attribute) => {
            if (domNode.hasAttribute(attribute)) {
                formats[attribute] = domNode.getAttribute(attribute);
            }
            return formats;
        }, {});
    }
    static match(url) {
        return /\.(jpe?g|gif|png)$/.test(url) || /^data:image\/.+;base64/.test(url);
    }
    static register() {
        if (/Firefox/i.test(navigator.userAgent)) {
            setTimeout(() => {
                // Disable image resizing in Firefox
                // @ts-expect-error
                document.execCommand('enableObjectResizing', false, false);
            }, 1);
        }
    }
    static sanitize(url) {
        return (0, link_1.sanitize)(url, ['http', 'https', 'data']) ? url : '//:0';
    }
    static value(domNode) {
        return domNode.getAttribute('src');
    }
    format(name, value) {
        if (ATTRIBUTES.indexOf(name) > -1) {
            if (value) {
                this.domNode.setAttribute(name, value);
            }
            else {
                this.domNode.removeAttribute(name);
            }
        }
        else {
            super.format(name, value);
        }
    }
}
Image.blotName = 'image';
Image.tagName = 'IMG';
exports.default = Image;
//# sourceMappingURL=image.js.map