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
exports.AttributeMap = exports.OpIterator = exports.Op = exports.Delta = void 0;
const quill_1 = __importDefault(require("./core/quill"));
const block_1 = __importStar(require("./blots/block"));
const break_1 = __importDefault(require("./blots/break"));
const container_1 = __importDefault(require("./blots/container"));
const cursor_1 = __importDefault(require("./blots/cursor"));
const embed_1 = __importDefault(require("./blots/embed"));
const inline_1 = __importDefault(require("./blots/inline"));
const scroll_1 = __importDefault(require("./blots/scroll"));
const text_1 = __importDefault(require("./blots/text"));
const clipboard_1 = __importDefault(require("./modules/clipboard"));
const history_1 = __importDefault(require("./modules/history"));
const keyboard_1 = __importDefault(require("./modules/keyboard"));
const selection_1 = __importDefault(require("./core/selection"));
const uploader_1 = __importDefault(require("./modules/uploader"));
const quill_delta_1 = __importStar(require("@reedsy/quill-delta"));
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