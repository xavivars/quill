import Quill from '../core';
import Clipboard from '../modules/clipboard';
import History from '../modules/history';
import Keyboard from '../modules/keyboard';
import Uploader from '../modules/uploader';
import Selection from '../core/selection';
interface ThemeOptions {
    modules: Record<string, unknown>;
}
declare class Theme {
    protected quill: Quill;
    protected options: ThemeOptions;
    static DEFAULTS: {
        modules: {};
    };
    static themes: {
        default: typeof Theme;
    };
    modules: Record<string, unknown>;
    constructor(quill: Quill, options: ThemeOptions);
    init(): void;
    addModule(name: 'clipboard'): Clipboard;
    addModule(name: 'keyboard'): Keyboard;
    addModule(name: 'uploader'): Uploader;
    addModule(name: 'history'): History;
    addModule(name: 'selection'): Selection;
    addModule(name: string): unknown;
}
export interface ThemeConstructor {
    new (quill: Quill, options: unknown): Theme;
}
export default Theme;
