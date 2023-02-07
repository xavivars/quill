import { Page } from '@playwright/test';
declare class QuillPage {
    private page;
    constructor(page: Page);
    get root(): import("playwright-core").Locator;
    editorHTML(): Promise<string>;
}
export default QuillPage;
