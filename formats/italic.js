"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bold_1 = __importDefault(require("./bold"));
class Italic extends bold_1.default {
}
Italic.blotName = 'italic';
Italic.tagName = ['EM', 'I'];
exports.default = Italic;
//# sourceMappingURL=italic.js.map