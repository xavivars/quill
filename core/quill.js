"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exports.overload = exports.expandConfig = exports.globalRegistry = void 0;
const rfdc_1 = require("rfdc");
const lodash_merge_1 = require("lodash.merge");
const Parchment = require("parchment");
const quill_delta_1 = require("@reedsy/quill-delta");
const editor_1 = require("./editor");
const emitter_1 = require("./emitter");
const instances_1 = require("./instances");
const logger_1 = require("./logger");
const module_1 = require("./module");
const selection_1 = require("./selection");
const theme_1 = require("./theme");
const cloneDeep = (0, rfdc_1.default)();
const debug = (0, logger_1.default)('quill');
const globalRegistry = new Parchment.Registry();
exports.globalRegistry = globalRegistry;
Parchment.ParentBlot.uiClass = 'ql-ui';
class Quill {
    constructor(container, options = {}) {
        this.options = expandConfig(container, options);
        this.container = this.options.container;
        if (this.container == null) {
            debug.error('Invalid Quill container', container);
            return;
        }
        if (this.options.debug) {
            Quill.debug(this.options.debug);
        }
        const html = this.container.innerHTML.trim();
        this.container.classList.add('ql-container');
        this.container.innerHTML = '';
        instances_1.default.set(this.container, this);
        this.root = this.addContainer('ql-editor');
        this.root.classList.add('ql-blank');
        this.scrollingContainer = this.options.scrollingContainer || this.root;
        this.emitter = new emitter_1.default();
        // @ts-expect-error TODO: fix BlotConstructor
        const ScrollBlot = this.options.registry.query(Parchment.ScrollBlot.blotName);
        this.scroll = new ScrollBlot(this.options.registry, this.root, {
            emitter: this.emitter,
        });
        this.editor = new editor_1.default(this.scroll);
        this.theme = new this.options.theme(this, this.options); // eslint-disable-line new-cap
        this.selection = this.theme.addModule('selection');
        this.keyboard = this.theme.addModule('keyboard');
        this.clipboard = this.theme.addModule('clipboard');
        this.history = this.theme.addModule('history');
        this.uploader = this.theme.addModule('uploader');
        this.theme.init();
        this.emitter.on(emitter_1.default.events.EDITOR_CHANGE, type => {
            if (type === emitter_1.default.events.TEXT_CHANGE) {
                this.root.classList.toggle('ql-blank', this.editor.isBlank());
            }
        });
        this.emitter.on(emitter_1.default.events.SCROLL_UPDATE, (source, mutations) => {
            const oldRange = this.selection.lastRange;
            const [newRange] = this.selection.getRange();
            const selectionInfo = oldRange && newRange ? { oldRange, newRange } : undefined;
            modify.call(this, () => this.editor.update(null, mutations, selectionInfo), source);
        });
        this.emitter.on(emitter_1.default.events.SCROLL_EMBED_UPDATE, (blot, delta) => {
            const oldRange = this.selection.lastRange;
            const [newRange] = this.selection.getRange();
            const selectionInfo = oldRange && newRange ? { oldRange, newRange } : undefined;
            modify.call(this, () => {
                const change = new quill_delta_1.default()
                    .retain(blot.offset(this))
                    .retain({ [blot.statics.blotName]: delta });
                return this.editor.update(change, [], selectionInfo);
            }, Quill.sources.USER);
        });
        if (html) {
            const contents = this.clipboard.convert({
                html: `${html}<p><br></p>`,
                text: '\n',
            });
            this.setContents(contents);
        }
        this.history.clear();
        if (this.options.placeholder) {
            this.root.setAttribute('data-placeholder', this.options.placeholder);
        }
        if (this.options.readOnly) {
            this.disable();
        }
        this.allowReadOnlyEdits = false;
    }
    static debug(limit) {
        if (limit === true) {
            limit = 'log';
        }
        logger_1.default.level(limit);
    }
    static find(node, bubble = false) {
        return instances_1.default.get(node) || globalRegistry.find(node, bubble);
    }
    static import(name) {
        if (this.imports[name] == null) {
            debug.error(`Cannot import ${name}. Are you sure it was registered?`);
        }
        return this.imports[name];
    }
    static register(path, target, overwrite = false) {
        if (typeof path !== 'string') {
            const name = 'attrName' in path ? path.attrName : path.blotName;
            if (typeof name === 'string') {
                // register(Blot | Attributor, overwrite)
                // @ts-expect-error
                this.register(`formats/${name}`, path, target);
            }
            else {
                Object.keys(path).forEach(key => {
                    // @ts-expect-error
                    this.register(key, path[key], target);
                });
            }
        }
        else {
            if (this.imports[path] != null && !overwrite) {
                debug.warn(`Overwriting ${path} with`, target);
            }
            this.imports[path] = target;
            if ((path.startsWith('blots/') || path.startsWith('formats/')) &&
                // @ts-expect-error
                target.blotName !== 'abstract') {
                globalRegistry.register(target);
            }
            // @ts-expect-error
            if (typeof target.register === 'function') {
                // @ts-expect-error
                target.register(globalRegistry);
            }
        }
    }
    addContainer(container, refNode = null) {
        if (typeof container === 'string') {
            const className = container;
            container = document.createElement('div');
            container.classList.add(className);
        }
        this.container.insertBefore(container, refNode);
        return container;
    }
    blur() {
        this.selection.setRange(null);
    }
    deleteText(index, length, source) {
        // @ts-expect-error
        [index, length, , source] = overload(index, length, source);
        return modify.call(this, () => {
            // @ts-expect-error
            return this.editor.deleteText(index, length);
        }, source, index, -1 * length);
    }
    disable() {
        this.enable(false);
    }
    editReadOnly(modifier) {
        this.allowReadOnlyEdits = true;
        const value = modifier();
        this.allowReadOnlyEdits = false;
        return value;
    }
    enable(enabled = true) {
        this.scroll.enable(enabled);
        this.container.classList.toggle('ql-disabled', !enabled);
    }
    focus() {
        const { scrollTop } = this.scrollingContainer;
        this.selection.focus();
        this.scrollingContainer.scrollTop = scrollTop;
        this.scrollIntoView();
    }
    format(name, value, source = emitter_1.default.sources.API) {
        return modify.call(this, () => {
            const range = this.getSelection(true);
            let change = new quill_delta_1.default();
            if (range == null)
                return change;
            if (this.scroll.query(name, Parchment.Scope.BLOCK)) {
                change = this.editor.formatLine(range.index, range.length, {
                    [name]: value,
                });
            }
            else if (range.length === 0) {
                this.selection.format(name, value);
                return change;
            }
            else {
                change = this.editor.formatText(range.index, range.length, {
                    [name]: value,
                });
            }
            this.setSelection(range, emitter_1.default.sources.SILENT);
            return change;
        }, source);
    }
    formatLine(index, length, name, value, source) {
        let formats;
        // eslint-disable-next-line prefer-const
        [index, length, formats, source] = overload(index, length, 
        // @ts-expect-error
        name, value, source);
        return modify.call(this, () => {
            return this.editor.formatLine(index, length, formats);
        }, source, index, 0);
    }
    formatText(index, length, name, value, source) {
        let formats;
        // eslint-disable-next-line prefer-const
        [index, length, formats, source] = overload(
        // @ts-expect-error
        index, length, name, value, source);
        return modify.call(this, () => {
            // @ts-expect-error
            return this.editor.formatText(index, length, formats);
        }, source, index, 0);
    }
    getBounds(index, length = 0) {
        let bounds;
        if (typeof index === 'number') {
            bounds = this.selection.getBounds(index, length);
        }
        else {
            bounds = this.selection.getBounds(index.index, index.length);
        }
        if (!bounds)
            return null;
        const containerBounds = this.container.getBoundingClientRect();
        return {
            bottom: bounds.bottom - containerBounds.top,
            height: bounds.height,
            left: bounds.left - containerBounds.left,
            right: bounds.right - containerBounds.left,
            top: bounds.top - containerBounds.top,
            width: bounds.width,
        };
    }
    getContents(index = 0, length = this.getLength() - index) {
        [index, length] = overload(index, length);
        return this.editor.getContents(index, length);
    }
    getFormat(index = this.getSelection(true), length = 0) {
        if (typeof index === 'number') {
            return this.editor.getFormat(index, length);
        }
        return this.editor.getFormat(index.index, index.length);
    }
    getIndex(blot) {
        return blot.offset(this.scroll);
    }
    getLength() {
        return this.scroll.length();
    }
    getLeaf(index) {
        return this.scroll.leaf(index);
    }
    getLine(index) {
        return this.scroll.line(index);
    }
    getLines(index = 0, length = Number.MAX_VALUE) {
        if (typeof index !== 'number') {
            return this.scroll.lines(index.index, index.length);
        }
        return this.scroll.lines(index, length);
    }
    getModule(name) {
        return this.theme.modules[name];
    }
    getSelection(focus = false, source = emitter_1.default.sources.API) {
        if (focus)
            this.focus();
        this.update(source); // Make sure we access getRange with editor in consistent state
        return this.selection.getRange()[0];
    }
    getSemanticHTML(index = 0, length) {
        if (typeof index === 'number') {
            length = this.getLength() - index;
        }
        // @ts-expect-error
        [index, length] = overload(index, length);
        return this.editor.getHTML(index, length);
    }
    getText(index = 0, length) {
        if (typeof index === 'number') {
            length = this.getLength() - index;
        }
        // @ts-expect-error
        [index, length] = overload(index, length);
        return this.editor.getText(index, length);
    }
    hasFocus() {
        return this.selection.hasFocus();
    }
    insertEmbed(index, embed, value, source = Quill.sources.API) {
        return modify.call(this, () => {
            return this.editor.insertEmbed(index, embed, value);
        }, source, index);
    }
    insertText(index, text, name, value, source) {
        let formats;
        // eslint-disable-next-line prefer-const
        [index, , formats, source] = overload(index, 0, name, value, source);
        return modify.call(this, () => {
            return this.editor.insertText(index, text, formats);
        }, source, index, text.length);
    }
    isEnabled() {
        return this.scroll.isEnabled();
    }
    off(...args) {
        return this.emitter.off(...args);
    }
    on(...args) {
        return this.emitter.on(...args);
    }
    once(...args) {
        return this.emitter.once(...args);
    }
    removeFormat(...args) {
        const [index, length, , source] = overload(...args);
        return modify.call(this, () => {
            return this.editor.removeFormat(index, length);
        }, source, index);
    }
    scrollIntoView() {
        this.selection.scrollIntoView(this.scrollingContainer);
    }
    setContents(delta, source = emitter_1.default.sources.API) {
        return modify.call(this, () => {
            delta = new quill_delta_1.default(delta);
            const length = this.getLength();
            // Quill will set empty editor to \n
            const delete1 = this.editor.deleteText(0, length);
            // delta always applied before existing content
            const applied = this.editor.applyDelta(delta);
            // Remove extra \n from empty editor initialization
            const delete2 = this.editor.deleteText(this.getLength() - 1, 1);
            return delete1.compose(applied).compose(delete2);
        }, source);
    }
    setSelection(index, length, source) {
        if (index == null) {
            // @ts-expect-error https://github.com/microsoft/TypeScript/issues/22609
            this.selection.setRange(null, length || Quill.sources.API);
        }
        else {
            // @ts-expect-error
            [index, length, , source] = overload(index, length, source);
            this.selection.setRange(new selection_1.Range(Math.max(0, index), length), source);
            if (source !== emitter_1.default.sources.SILENT) {
                this.scrollIntoView();
            }
        }
    }
    setText(text, source = emitter_1.default.sources.API) {
        const delta = new quill_delta_1.default().insert(text);
        return this.setContents(delta, source);
    }
    update(source = emitter_1.default.sources.USER) {
        const change = this.scroll.update(source); // Will update selection before selection.update() does if text changes
        this.selection.update(source);
        // TODO this is usually undefined
        return change;
    }
    updateContents(delta, source = emitter_1.default.sources.API) {
        return modify.call(this, () => {
            delta = new quill_delta_1.default(delta);
            return this.editor.applyDelta(delta);
        }, source, true);
    }
}
exports.default = Quill;
Quill.DEFAULTS = {
    bounds: null,
    modules: {},
    placeholder: '',
    readOnly: false,
    registry: globalRegistry,
    scrollingContainer: null,
    theme: 'default',
};
Quill.events = emitter_1.default.events;
Quill.sources = emitter_1.default.sources;
// eslint-disable-next-line no-undef
// @ts-expect-error defined in webpack
Quill.version = typeof QUILL_VERSION === 'undefined' ? 'dev' : QUILL_VERSION;
Quill.imports = {
    delta: quill_delta_1.default,
    parchment: Parchment,
    'core/module': module_1.default,
    'core/theme': theme_1.default,
};
function expandConfig(container, userConfig) {
    let expandedConfig = (0, lodash_merge_1.default)({
        container,
        modules: {
            clipboard: true,
            keyboard: true,
            history: true,
            selection: true,
            uploader: true,
        },
    }, userConfig);
    if (!expandedConfig.theme || expandedConfig.theme === Quill.DEFAULTS.theme) {
        expandedConfig.theme = theme_1.default;
    }
    else {
        expandedConfig.theme = Quill.import(`themes/${expandedConfig.theme}`);
        if (expandedConfig.theme == null) {
            throw new Error(`Invalid theme ${expandedConfig.theme}. Did you register it?`);
        }
    }
    const themeConfig = cloneDeep(expandedConfig.theme.DEFAULTS);
    [themeConfig, expandedConfig].forEach(config => {
        config.modules = config.modules || {};
        Object.keys(config.modules).forEach(module => {
            if (config.modules[module] === true) {
                config.modules[module] = {};
            }
        });
    });
    const moduleNames = Object.keys(themeConfig.modules).concat(Object.keys(expandedConfig.modules));
    const moduleConfig = moduleNames.reduce((config, name) => {
        const moduleClass = Quill.import(`modules/${name}`);
        if (moduleClass == null) {
            debug.error(`Cannot load ${name} module. Are you sure you registered it?`);
        }
        else {
            // @ts-expect-error
            config[name] = moduleClass.DEFAULTS || {};
        }
        return config;
    }, {});
    // Special case toolbar shorthand
    if (expandedConfig.modules != null &&
        expandedConfig.modules.toolbar &&
        expandedConfig.modules.toolbar.constructor !== Object) {
        expandedConfig.modules.toolbar = {
            container: expandedConfig.modules.toolbar,
        };
    }
    expandedConfig = (0, lodash_merge_1.default)({}, Quill.DEFAULTS, { modules: moduleConfig }, themeConfig, expandedConfig);
    ['bounds', 'container', 'scrollingContainer'].forEach(key => {
        if (typeof expandedConfig[key] === 'string') {
            expandedConfig[key] = document.querySelector(expandedConfig[key]);
        }
    });
    expandedConfig.modules = Object.keys(expandedConfig.modules).reduce((config, name) => {
        if (expandedConfig.modules[name]) {
            config[name] = expandedConfig.modules[name];
        }
        return config;
    }, {});
    return expandedConfig;
}
exports.expandConfig = expandConfig;
// Handle selection preservation and TEXT_CHANGE emission
// common to modification APIs
function modify(modifier, source, index, shift) {
    if (!this.isEnabled() &&
        source === emitter_1.default.sources.USER &&
        !this.allowReadOnlyEdits) {
        return new quill_delta_1.default();
    }
    let range = index == null ? null : this.getSelection();
    const oldDelta = this.editor.delta;
    const change = modifier();
    if (range != null) {
        if (index === true) {
            index = range.index; // eslint-disable-line prefer-destructuring
        }
        if (shift == null) {
            range = shiftRange(range, change, source);
        }
        else if (shift !== 0) {
            range = shiftRange(range, index, shift, source);
        }
        this.setSelection(range, emitter_1.default.sources.SILENT);
    }
    if (change.length() > 0) {
        const args = [emitter_1.default.events.TEXT_CHANGE, change, oldDelta, source];
        this.emitter.emit(emitter_1.default.events.EDITOR_CHANGE, ...args);
        if (source !== emitter_1.default.sources.SILENT) {
            this.emitter.emit(...args);
        }
    }
    return change;
}
function overload(index, length, name, value, source) {
    let formats = {};
    // @ts-expect-error
    if (typeof index.index === 'number' && typeof index.length === 'number') {
        // Allow for throwaway end (used by insertText/insertEmbed)
        if (typeof length !== 'number') {
            // @ts-expect-error
            source = value;
            value = name;
            name = length;
            // @ts-expect-error
            length = index.length; // eslint-disable-line prefer-destructuring
            // @ts-expect-error
            index = index.index; // eslint-disable-line prefer-destructuring
        }
        else {
            // @ts-expect-error
            length = index.length; // eslint-disable-line prefer-destructuring
            // @ts-expect-error
            index = index.index; // eslint-disable-line prefer-destructuring
        }
    }
    else if (typeof length !== 'number') {
        // @ts-expect-error
        source = value;
        value = name;
        name = length;
        length = 0;
    }
    // Handle format being object, two format name/value strings or excluded
    if (typeof name === 'object') {
        formats = name;
        // @ts-expect-error
        source = value;
    }
    else if (typeof name === 'string') {
        if (value != null) {
            formats[name] = value;
        }
        else {
            // @ts-expect-error
            source = name;
        }
    }
    // Handle optional source
    source = source || emitter_1.default.sources.API;
    // @ts-expect-error
    return [index, length, formats, source];
}
exports.overload = overload;
function shiftRange(range, index, length, source) {
    if (range == null)
        return null;
    let start;
    let end;
    if (index && typeof index.transformPosition === 'function') {
        [start, end] = [range.index, range.index + range.length].map(pos => index.transformPosition(pos, source !== emitter_1.default.sources.USER));
    }
    else {
        [start, end] = [range.index, range.index + range.length].map(pos => {
            if (pos < index || (pos === index && source === emitter_1.default.sources.USER))
                return pos;
            if (length >= 0) {
                return pos + length;
            }
            return Math.max(index, pos + length);
        });
    }
    return new selection_1.Range(start, end - start);
}
//# sourceMappingURL=quill.js.map