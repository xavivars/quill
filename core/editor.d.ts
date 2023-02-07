import Delta from '@reedsy/quill-delta';
import Scroll from '../blots/scroll';
declare class Editor {
    scroll: Scroll;
    delta: Delta;
    constructor(scroll: Scroll);
    applyDelta(delta: Delta): Delta;
    deleteText(index: number, length: number): Delta;
    formatLine(index: number, length: number, formats?: Record<string, unknown>): Delta;
    formatText(index: number, length: number, formats?: Record<string, unknown>): Delta;
    getContents(index: number, length: number): Delta;
    getDelta(): Delta;
    getFormat(index: number, length?: number): Record<string, unknown>;
    getHTML(index: number, length: number): string;
    getText(index: number, length: number): string;
    insertEmbed(index: number, embed: string, value: unknown): Delta;
    insertText(index: number, text: string, formats?: Record<string, unknown>): Delta;
    isBlank(): boolean;
    removeFormat(index: number, length: number): Delta;
    update(change: Delta, mutations?: any[], selectionInfo?: any): Delta;
}
export default Editor;
