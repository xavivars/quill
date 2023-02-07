"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const quill_delta_1 = __importDefault(require("@reedsy/quill-delta"));
const emitter_1 = __importDefault(require("../core/emitter"));
const module_1 = __importDefault(require("../core/module"));
class Uploader extends module_1.default {
    constructor(quill, options) {
        super(quill, options);
        quill.root.addEventListener('drop', e => {
            e.preventDefault();
            let native;
            if (document.caretRangeFromPoint) {
                native = document.caretRangeFromPoint(e.clientX, e.clientY);
                // @ts-expect-error
            }
            else if (document.caretPositionFromPoint) {
                // @ts-expect-error
                const position = document.caretPositionFromPoint(e.clientX, e.clientY);
                native = document.createRange();
                native.setStart(position.offsetNode, position.offset);
                native.setEnd(position.offsetNode, position.offset);
            }
            else {
                return;
            }
            const normalized = quill.selection.normalizeNative(native);
            const range = quill.selection.normalizedToRange(normalized);
            this.upload(range, e.dataTransfer.files);
        });
    }
    upload(range, files) {
        const uploads = [];
        Array.from(files).forEach(file => {
            if (file && this.options.mimetypes.includes(file.type)) {
                uploads.push(file);
            }
        });
        if (uploads.length > 0) {
            this.options.handler.call(this, range, uploads);
        }
    }
}
Uploader.DEFAULTS = {
    mimetypes: ['image/png', 'image/jpeg'],
    handler(range, files) {
        const promises = files.map(file => {
            return new Promise(resolve => {
                const reader = new FileReader();
                reader.onload = e => {
                    resolve(e.target.result);
                };
                reader.readAsDataURL(file);
            });
        });
        Promise.all(promises).then(images => {
            const update = images.reduce((delta, image) => {
                return delta.insert({ image });
            }, new quill_delta_1.default().retain(range.index).delete(range.length));
            this.quill.updateContents(update, emitter_1.default.sources.USER);
            this.quill.setSelection(range.index + images.length, emitter_1.default.sources.SILENT);
        });
    },
};
exports.default = Uploader;
//# sourceMappingURL=uploader.js.map