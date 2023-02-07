"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_merge_1 = require("lodash.merge");
const emitter_1 = require("../core/emitter");
const base_1 = require("./base");
const link_1 = require("../formats/link");
const selection_1 = require("../core/selection");
const icons_1 = require("../ui/icons");
const TOOLBAR_CONFIG = [
    [{ header: ['1', '2', '3', false] }],
    ['bold', 'italic', 'underline', 'link'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['clean'],
];
class SnowTooltip extends base_1.BaseTooltip {
    constructor() {
        super(...arguments);
        this.preview = this.root.querySelector('a.ql-preview');
    }
    listen() {
        super.listen();
        this.root.querySelector('a.ql-action').addEventListener('click', event => {
            if (this.root.classList.contains('ql-editing')) {
                this.save();
            }
            else {
                this.edit('link', this.preview.textContent);
            }
            event.preventDefault();
        });
        this.root.querySelector('a.ql-remove').addEventListener('click', event => {
            if (this.linkRange != null) {
                const range = this.linkRange;
                this.restoreFocus();
                this.quill.formatText(range, 'link', false, emitter_1.default.sources.USER);
                delete this.linkRange;
            }
            event.preventDefault();
            this.hide();
        });
        this.quill.on(emitter_1.default.events.SELECTION_CHANGE, (range, oldRange, source) => {
            if (range == null)
                return;
            if (range.length === 0 && source === emitter_1.default.sources.USER) {
                const [link, offset] = this.quill.scroll.descendant(
                // @ts-expect-error
                link_1.default, range.index);
                if (link != null) {
                    this.linkRange = new selection_1.Range(range.index - offset, link.length());
                    const preview = link_1.default.formats(link.domNode);
                    this.preview.textContent = preview;
                    this.preview.setAttribute('href', preview);
                    this.show();
                    this.position(this.quill.getBounds(this.linkRange));
                    return;
                }
            }
            else {
                delete this.linkRange;
            }
            this.hide();
        });
    }
    show() {
        super.show();
        this.root.removeAttribute('data-mode');
    }
}
SnowTooltip.TEMPLATE = [
    '<a class="ql-preview" rel="noopener noreferrer" target="_blank" href="about:blank"></a>',
    '<input type="text" data-formula="e=mc^2" data-link="https://quilljs.com" data-video="Embed URL">',
    '<a class="ql-action"></a>',
    '<a class="ql-remove"></a>',
].join('');
class SnowTheme extends base_1.default {
    constructor(quill, options) {
        if (options.modules.toolbar != null &&
            options.modules.toolbar.container == null) {
            options.modules.toolbar.container = TOOLBAR_CONFIG;
        }
        super(quill, options);
        this.quill.container.classList.add('ql-snow');
    }
    extendToolbar(toolbar) {
        toolbar.container.classList.add('ql-snow');
        this.buildButtons(toolbar.container.querySelectorAll('button'), icons_1.default);
        this.buildPickers(toolbar.container.querySelectorAll('select'), icons_1.default);
        // @ts-expect-error
        this.tooltip = new SnowTooltip(this.quill, this.options.bounds);
        if (toolbar.container.querySelector('.ql-link')) {
            this.quill.keyboard.addBinding({ key: 'k', shortKey: true }, (range, context) => {
                toolbar.handlers.link.call(toolbar, !context.format.link);
            });
        }
    }
}
SnowTheme.DEFAULTS = (0, lodash_merge_1.default)({}, base_1.default.DEFAULTS, {
    modules: {
        toolbar: {
            handlers: {
                link(value) {
                    if (value) {
                        const range = this.quill.getSelection();
                        if (range == null || range.length === 0)
                            return;
                        let preview = this.quill.getText(range);
                        if (/^\S+@\S+\.\S+$/.test(preview) &&
                            preview.indexOf('mailto:') !== 0) {
                            preview = `mailto:${preview}`;
                        }
                        const { tooltip } = this.quill.theme;
                        tooltip.edit('link', preview);
                    }
                    else {
                        this.quill.format('link', false);
                    }
                },
            },
        },
    },
});
exports.default = SnowTheme;
//# sourceMappingURL=snow.js.map