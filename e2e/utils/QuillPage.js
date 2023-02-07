"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class QuillPage {
    constructor(page) {
        this.page = page;
    }
    get root() {
        return this.page.locator('.ql-editor');
    }
    editorHTML() {
        return this.root.innerHTML();
    }
}
exports.default = QuillPage;
//# sourceMappingURL=QuillPage.js.map