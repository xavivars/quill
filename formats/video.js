"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const block_1 = require("../blots/block");
const link_1 = require("./link");
const ATTRIBUTES = ['height', 'width'];
class Video extends block_1.BlockEmbed {
    static create(value) {
        const node = super.create(value);
        node.setAttribute('frameborder', '0');
        node.setAttribute('allowfullscreen', 'true');
        node.setAttribute('src', this.sanitize(value));
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
    static sanitize(url) {
        return link_1.default.sanitize(url);
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
    html() {
        const { video } = this.value();
        return `<a href="${video}">${video}</a>`;
    }
}
Video.blotName = 'video';
Video.className = 'ql-video';
Video.tagName = 'IFRAME';
exports.default = Video;
//# sourceMappingURL=video.js.map