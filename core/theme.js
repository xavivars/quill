"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Theme {
    constructor(quill, options) {
        this.quill = quill;
        this.options = options;
        this.modules = {};
    }
    init() {
        Object.keys(this.options.modules).forEach(name => {
            if (this.modules[name] == null) {
                this.addModule(name);
            }
        });
    }
    addModule(name) {
        // @ts-expect-error
        const ModuleClass = this.quill.constructor.import(`modules/${name}`);
        this.modules[name] = new ModuleClass(this.quill, this.options.modules[name] || {});
        return this.modules[name];
    }
}
Theme.DEFAULTS = {
    modules: {},
};
Theme.themes = {
    default: Theme,
};
exports.default = Theme;
//# sourceMappingURL=theme.js.map