"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addControls = exports.default = void 0;
const quill_delta_1 = require("@reedsy/quill-delta");
const parchment_1 = require("parchment");
const quill_1 = require("../core/quill");
const logger_1 = require("../core/logger");
const module_1 = require("../core/module");
const debug = (0, logger_1.default)('quill:toolbar');
class Toolbar extends module_1.default {
    constructor(quill, options) {
        super(quill, options);
        if (Array.isArray(this.options.container)) {
            const container = document.createElement('div');
            addControls(container, this.options.container);
            quill.container.parentNode.insertBefore(container, quill.container);
            this.container = container;
        }
        else if (typeof this.options.container === 'string') {
            this.container = document.querySelector(this.options.container);
        }
        else {
            this.container = this.options.container;
        }
        if (!(this.container instanceof HTMLElement)) {
            debug.error('Container required for toolbar', this.options);
            return;
        }
        this.container.classList.add('ql-toolbar');
        this.controls = [];
        this.handlers = {};
        // @ts-expect-error
        Object.keys(this.options.handlers).forEach(format => {
            // @ts-expect-error
            this.addHandler(format, this.options.handlers[format]);
        });
        Array.from(this.container.querySelectorAll('button, select')).forEach(input => {
            // @ts-expect-error
            this.attach(input);
        });
        this.quill.on(quill_1.default.events.EDITOR_CHANGE, () => {
            const [range] = this.quill.selection.getRange(); // quill.getSelection triggers update
            this.update(range);
        });
    }
    addHandler(format, handler) {
        this.handlers[format] = handler;
    }
    attach(input) {
        let format = Array.from(input.classList).find(className => {
            return className.indexOf('ql-') === 0;
        });
        if (!format)
            return;
        format = format.slice('ql-'.length);
        if (input.tagName === 'BUTTON') {
            input.setAttribute('type', 'button');
        }
        if (this.handlers[format] == null &&
            this.quill.scroll.query(format) == null) {
            debug.warn('ignoring attaching to nonexistent format', format, input);
            return;
        }
        const eventName = input.tagName === 'SELECT' ? 'change' : 'click';
        input.addEventListener(eventName, e => {
            let value;
            if (input.tagName === 'SELECT') {
                // @ts-expect-error
                if (input.selectedIndex < 0)
                    return;
                // @ts-expect-error
                const selected = input.options[input.selectedIndex];
                if (selected.hasAttribute('selected')) {
                    value = false;
                }
                else {
                    value = selected.value || false;
                }
            }
            else {
                if (input.classList.contains('ql-active')) {
                    value = false;
                }
                else {
                    // @ts-expect-error
                    value = input.value || !input.hasAttribute('value');
                }
                e.preventDefault();
            }
            this.quill.focus();
            const [range] = this.quill.selection.getRange();
            if (this.handlers[format] != null) {
                this.handlers[format].call(this, value);
            }
            else if (
            // @ts-expect-error
            this.quill.scroll.query(format).prototype instanceof parchment_1.EmbedBlot) {
                value = prompt(`Enter ${format}`); // eslint-disable-line no-alert
                if (!value)
                    return;
                this.quill.updateContents(new quill_delta_1.default()
                    .retain(range.index)
                    .delete(range.length)
                    .insert({ [format]: value }), quill_1.default.sources.USER);
            }
            else {
                this.quill.format(format, value, quill_1.default.sources.USER);
            }
            this.update(range);
        });
        this.controls.push([format, input]);
    }
    update(range) {
        const formats = range == null ? {} : this.quill.getFormat(range);
        this.controls.forEach(pair => {
            const [format, input] = pair;
            if (input.tagName === 'SELECT') {
                let option;
                if (range == null) {
                    option = null;
                }
                else if (formats[format] == null) {
                    option = input.querySelector('option[selected]');
                }
                else if (!Array.isArray(formats[format])) {
                    let value = formats[format];
                    if (typeof value === 'string') {
                        value = value.replace(/"/g, '\\"');
                    }
                    option = input.querySelector(`option[value="${value}"]`);
                }
                if (option == null) {
                    // @ts-expect-error
                    input.value = ''; // TODO make configurable?
                    // @ts-expect-error
                    input.selectedIndex = -1;
                }
                else {
                    option.selected = true;
                }
            }
            else if (range == null) {
                input.classList.remove('ql-active');
            }
            else if (input.hasAttribute('value')) {
                // both being null should match (default values)
                // '1' should match with 1 (headers)
                const isActive = formats[format] === input.getAttribute('value') ||
                    (formats[format] != null &&
                        formats[format].toString() === input.getAttribute('value')) ||
                    (formats[format] == null && !input.getAttribute('value'));
                input.classList.toggle('ql-active', isActive);
            }
            else {
                input.classList.toggle('ql-active', formats[format] != null);
            }
        });
    }
}
exports.default = Toolbar;
Toolbar.DEFAULTS = {};
function addButton(container, format, value) {
    const input = document.createElement('button');
    input.setAttribute('type', 'button');
    input.classList.add(`ql-${format}`);
    if (value != null) {
        // @ts-expect-error
        input.value = value;
    }
    container.appendChild(input);
}
function addControls(container, groups) {
    if (!Array.isArray(groups[0])) {
        // @ts-expect-error
        groups = [groups];
    }
    groups.forEach(controls => {
        const group = document.createElement('span');
        group.classList.add('ql-formats');
        controls.forEach(control => {
            if (typeof control === 'string') {
                addButton(group, control);
            }
            else {
                const format = Object.keys(control)[0];
                const value = control[format];
                if (Array.isArray(value)) {
                    addSelect(group, format, value);
                }
                else {
                    addButton(group, format, value);
                }
            }
        });
        container.appendChild(group);
    });
}
exports.addControls = addControls;
function addSelect(container, format, values) {
    const input = document.createElement('select');
    input.classList.add(`ql-${format}`);
    values.forEach(value => {
        const option = document.createElement('option');
        if (value !== false) {
            option.setAttribute('value', value);
        }
        else {
            option.setAttribute('selected', 'selected');
        }
        input.appendChild(option);
    });
    container.appendChild(input);
}
Toolbar.DEFAULTS = {
    container: null,
    handlers: {
        clean() {
            const range = this.quill.getSelection();
            if (range == null)
                return;
            if (range.length === 0) {
                const formats = this.quill.getFormat();
                Object.keys(formats).forEach(name => {
                    // Clean functionality in existing apps only clean inline formats
                    if (this.quill.scroll.query(name, parchment_1.Scope.INLINE) != null) {
                        this.quill.format(name, false, quill_1.default.sources.USER);
                    }
                });
            }
            else {
                this.quill.removeFormat(range, quill_1.default.sources.USER);
            }
        },
        direction(value) {
            const { align } = this.quill.getFormat();
            if (value === 'rtl' && align == null) {
                this.quill.format('align', 'right', quill_1.default.sources.USER);
            }
            else if (!value && align === 'right') {
                this.quill.format('align', false, quill_1.default.sources.USER);
            }
            this.quill.format('direction', value, quill_1.default.sources.USER);
        },
        indent(value) {
            const range = this.quill.getSelection();
            const formats = this.quill.getFormat(range);
            const indent = parseInt(formats.indent || 0, 10);
            if (value === '+1' || value === '-1') {
                let modifier = value === '+1' ? 1 : -1;
                if (formats.direction === 'rtl')
                    modifier *= -1;
                this.quill.format('indent', indent + modifier, quill_1.default.sources.USER);
            }
        },
        link(value) {
            if (value === true) {
                value = prompt('Enter link URL:'); // eslint-disable-line no-alert
            }
            this.quill.format('link', value, quill_1.default.sources.USER);
        },
        list(value) {
            const range = this.quill.getSelection();
            const formats = this.quill.getFormat(range);
            if (value === 'check') {
                if (formats.list === 'checked' || formats.list === 'unchecked') {
                    this.quill.format('list', false, quill_1.default.sources.USER);
                }
                else {
                    this.quill.format('list', 'unchecked', quill_1.default.sources.USER);
                }
            }
            else {
                this.quill.format('list', value, quill_1.default.sources.USER);
            }
        },
    },
};
//# sourceMappingURL=toolbar.js.map