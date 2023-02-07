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
exports.default = exports.BubbleTooltip = void 0;
const lodash_merge_1 = __importDefault(require("lodash.merge"));
const emitter_1 = __importDefault(require("../core/emitter"));
const base_1 = __importStar(require("./base"));
const selection_1 = require("../core/selection");
const icons_1 = __importDefault(require("../ui/icons"));
const TOOLBAR_CONFIG = [
    ['bold', 'italic', 'link'],
    [{ header: 1 }, { header: 2 }, 'blockquote'],
];
class BubbleTooltip extends base_1.BaseTooltip {
    constructor(quill, bounds) {
        super(quill, bounds);
        this.quill.on(emitter_1.default.events.EDITOR_CHANGE, (type, range, oldRange, source) => {
            if (type !== emitter_1.default.events.SELECTION_CHANGE)
                return;
            if (range != null &&
                range.length > 0 &&
                source === emitter_1.default.sources.USER) {
                this.show();
                // Lock our width so we will expand beyond our offsetParent boundaries
                this.root.style.left = '0px';
                this.root.style.width = '';
                this.root.style.width = `${this.root.offsetWidth}px`;
                const lines = this.quill.getLines(range.index, range.length);
                if (lines.length === 1) {
                    this.position(this.quill.getBounds(range));
                }
                else {
                    const lastLine = lines[lines.length - 1];
                    const index = this.quill.getIndex(lastLine);
                    const length = Math.min(lastLine.length() - 1, range.index + range.length - index);
                    const indexBounds = this.quill.getBounds(new selection_1.Range(index, length));
                    this.position(indexBounds);
                }
            }
            else if (document.activeElement !== this.textbox &&
                this.quill.hasFocus()) {
                this.hide();
            }
        });
    }
    listen() {
        super.listen();
        this.root.querySelector('.ql-close').addEventListener('click', () => {
            this.root.classList.remove('ql-editing');
        });
        this.quill.on(emitter_1.default.events.SCROLL_OPTIMIZE, () => {
            // Let selection be restored by toolbar handlers before repositioning
            setTimeout(() => {
                if (this.root.classList.contains('ql-hidden'))
                    return;
                const range = this.quill.getSelection();
                if (range != null) {
                    this.position(this.quill.getBounds(range));
                }
            }, 1);
        });
    }
    cancel() {
        this.show();
    }
    position(reference) {
        const shift = super.position(reference);
        const arrow = this.root.querySelector('.ql-tooltip-arrow');
        // @ts-expect-error
        arrow.style.marginLeft = '';
        if (shift !== 0) {
            // @ts-expect-error
            arrow.style.marginLeft = `${-1 * shift - arrow.offsetWidth / 2}px`;
        }
        return shift;
    }
}
exports.BubbleTooltip = BubbleTooltip;
BubbleTooltip.TEMPLATE = [
    '<span class="ql-tooltip-arrow"></span>',
    '<div class="ql-tooltip-editor">',
    '<input type="text" data-formula="e=mc^2" data-link="https://quilljs.com" data-video="Embed URL">',
    '<a class="ql-close"></a>',
    '</div>',
].join('');
class BubbleTheme extends base_1.default {
    constructor(quill, options) {
        if (options.modules.toolbar != null &&
            options.modules.toolbar.container == null) {
            options.modules.toolbar.container = TOOLBAR_CONFIG;
        }
        super(quill, options);
        this.quill.container.classList.add('ql-bubble');
    }
    extendToolbar(toolbar) {
        // @ts-expect-error
        this.tooltip = new BubbleTooltip(this.quill, this.options.bounds);
        this.tooltip.root.appendChild(toolbar.container);
        this.buildButtons(toolbar.container.querySelectorAll('button'), icons_1.default);
        this.buildPickers(toolbar.container.querySelectorAll('select'), icons_1.default);
    }
}
exports.default = BubbleTheme;
BubbleTheme.DEFAULTS = (0, lodash_merge_1.default)({}, base_1.default.DEFAULTS, {
    modules: {
        toolbar: {
            handlers: {
                link(value) {
                    if (!value) {
                        this.quill.format('link', false);
                    }
                    else {
                        this.quill.theme.tooltip.edit();
                    }
                },
            },
        },
    },
});
//# sourceMappingURL=bubble.js.map