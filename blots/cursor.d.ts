import { EmbedBlot, ScrollBlot } from 'parchment';
import Selection from '../core/selection';
declare class Cursor extends EmbedBlot {
    static blotName: string;
    static className: string;
    static tagName: string;
    static CONTENTS: string;
    static value(): any;
    selection: Selection;
    textNode: Text;
    savedLength: number;
    constructor(scroll: ScrollBlot, domNode: any, selection: Selection);
    detach(): void;
    format(name: any, value: any): void;
    index(node: any, offset: any): number;
    length(): number;
    position(): [Text, number];
    remove(): void;
    restore(): {
        startNode: any;
        startOffset: any;
        endNode: any;
        endOffset: any;
    };
    update(mutations: any, context: any): void;
    optimize(context?: unknown): void;
    value(): string;
}
export default Cursor;
