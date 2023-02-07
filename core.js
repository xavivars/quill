"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttributeMap = exports.OpIterator = exports.Op = exports.Delta = void 0;
const quill_1 = require("./core/quill");
const block_1 = require("./blots/block");
const break_1 = require("./blots/break");
const container_1 = require("./blots/container");
const cursor_1 = require("./blots/cursor");
const embed_1 = require("./blots/embed");
const inline_1 = require("./blots/inline");
const scroll_1 = require("./blots/scroll");
const text_1 = require("./blots/text");
const clipboard_1 = require("./modules/clipboard");
const history_1 = require("./modules/history");
const keyboard_1 = require("./modules/keyboard");
const selection_1 = require("./core/selection");
const uploader_1 = require("./modules/uploader");
const quill_delta_1 = require("@reedsy/quill-delta");
exports.Delta = quill_delta_1.default;
Object.defineProperty(exports, "Op", { enumerable: true, get: function () { return quill_delta_1.Op; } });
Object.defineProperty(exports, "OpIterator", { enumerable: true, get: function () { return quill_delta_1.OpIterator; } });
Object.defineProperty(exports, "AttributeMap", { enumerable: true, get: function () { return quill_delta_1.AttributeMap; } });
quill_1.default.register({
    'blots/block': block_1.default,
    'blots/block/embed': block_1.BlockEmbed,
    'blots/break': break_1.default,
    'blots/container': container_1.default,
    'blots/cursor': cursor_1.default,
    'blots/embed': embed_1.default,
    'blots/inline': inline_1.default,
    'blots/scroll': scroll_1.default,
    'blots/text': text_1.default,
    'modules/clipboard': clipboard_1.default,
    'modules/history': history_1.default,
    'modules/keyboard': keyboard_1.default,
    'modules/selection': selection_1.default,
    'modules/uploader': uploader_1.default,
});
exports.default = quill_1.default;
//# sourceMappingURL=core.js.map