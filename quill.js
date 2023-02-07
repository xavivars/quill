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
const core_1 = __importDefault(require("./core"));
const align_1 = require("./formats/align");
const direction_1 = require("./formats/direction");
const indent_1 = __importDefault(require("./formats/indent"));
const blockquote_1 = __importDefault(require("./formats/blockquote"));
const header_1 = __importDefault(require("./formats/header"));
const list_1 = __importDefault(require("./formats/list"));
const background_1 = require("./formats/background");
const color_1 = require("./formats/color");
const font_1 = require("./formats/font");
const size_1 = require("./formats/size");
const bold_1 = __importDefault(require("./formats/bold"));
const italic_1 = __importDefault(require("./formats/italic"));
const link_1 = __importDefault(require("./formats/link"));
const script_1 = __importDefault(require("./formats/script"));
const strike_1 = __importDefault(require("./formats/strike"));
const underline_1 = __importDefault(require("./formats/underline"));
const formula_1 = __importDefault(require("./formats/formula"));
const image_1 = __importDefault(require("./formats/image"));
const video_1 = __importDefault(require("./formats/video"));
const code_1 = __importStar(require("./formats/code"));
const syntax_1 = __importDefault(require("./modules/syntax"));
const table_1 = __importDefault(require("./modules/table"));
const toolbar_1 = __importDefault(require("./modules/toolbar"));
const icons_1 = __importDefault(require("./ui/icons"));
const picker_1 = __importDefault(require("./ui/picker"));
const color_picker_1 = __importDefault(require("./ui/color-picker"));
const icon_picker_1 = __importDefault(require("./ui/icon-picker"));
const tooltip_1 = __importDefault(require("./ui/tooltip"));
const bubble_1 = __importDefault(require("./themes/bubble"));
const snow_1 = __importDefault(require("./themes/snow"));
core_1.default.register({
    'attributors/attribute/direction': direction_1.DirectionAttribute,
    'attributors/class/align': align_1.AlignClass,
    'attributors/class/background': background_1.BackgroundClass,
    'attributors/class/color': color_1.ColorClass,
    'attributors/class/direction': direction_1.DirectionClass,
    'attributors/class/font': font_1.FontClass,
    'attributors/class/size': size_1.SizeClass,
    'attributors/style/align': align_1.AlignStyle,
    'attributors/style/background': background_1.BackgroundStyle,
    'attributors/style/color': color_1.ColorStyle,
    'attributors/style/direction': direction_1.DirectionStyle,
    'attributors/style/font': font_1.FontStyle,
    'attributors/style/size': size_1.SizeStyle,
}, true);
core_1.default.register({
    'formats/align': align_1.AlignClass,
    'formats/direction': direction_1.DirectionClass,
    'formats/indent': indent_1.default,
    'formats/background': background_1.BackgroundStyle,
    'formats/color': color_1.ColorStyle,
    'formats/font': font_1.FontClass,
    'formats/size': size_1.SizeClass,
    'formats/blockquote': blockquote_1.default,
    'formats/code-block': code_1.default,
    'formats/header': header_1.default,
    'formats/list': list_1.default,
    'formats/bold': bold_1.default,
    'formats/code': code_1.Code,
    'formats/italic': italic_1.default,
    'formats/link': link_1.default,
    'formats/script': script_1.default,
    'formats/strike': strike_1.default,
    'formats/underline': underline_1.default,
    'formats/formula': formula_1.default,
    'formats/image': image_1.default,
    'formats/video': video_1.default,
    'modules/syntax': syntax_1.default,
    'modules/table': table_1.default,
    'modules/toolbar': toolbar_1.default,
    'themes/bubble': bubble_1.default,
    'themes/snow': snow_1.default,
    'ui/icons': icons_1.default,
    'ui/picker': picker_1.default,
    'ui/icon-picker': icon_picker_1.default,
    'ui/color-picker': color_picker_1.default,
    'ui/tooltip': tooltip_1.default,
}, true);
exports.default = core_1.default;
//# sourceMappingURL=quill.js.map