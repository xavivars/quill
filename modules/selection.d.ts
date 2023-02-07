import Emitter, { EmitterSource } from '../core/emitter';
import Cursor from '../blots/cursor';
import Scroll from '../blots/scroll';
import Module from '../core/module';
declare type NativeRange = ReturnType<Document['createRange']>;
interface NormalizedRange {
    start: {
        node: NativeRange['startContainer'];
        offset: NativeRange['startOffset'];
    };
    end: {
        node: NativeRange['endContainer'];
        offset: NativeRange['endOffset'];
    };
    native: NativeRange;
}
declare class Range {
    index: number;
    length: number;
    constructor(index: number, length?: number);
}
declare class Selection extends Module {
    scroll: Scroll;
    emitter: Emitter;
    composing: boolean;
    mouseDown: boolean;
    root: HTMLElement;
    cursor: Cursor;
    savedRange: Range;
    lastRange: Range | null;
    lastNative: NormalizedRange | null;
    constructor(quill: any, options: any);
    handleComposition(): void;
    handleDragging(): void;
    focus(): void;
    format(format: any, value: any): void;
    getBounds(index: number, length?: number): DOMRect | {
        bottom: number;
        height: number;
        left: any;
        right: any;
        top: number;
        width: number;
    };
    getNativeRange(): NormalizedRange | null;
    getRange(): [Range, NormalizedRange] | [null, null];
    hasFocus(): boolean;
    normalizedToRange(range: NormalizedRange): Range;
    normalizeNative(nativeRange: NativeRange): {
        start: {
            node: Node;
            offset: number;
        };
        end: {
            node: Node;
            offset: number;
        };
        native: globalThis.Range;
    };
    rangeToNative(range: Range): [Node | null, number, Node | null, number];
    scrollIntoView(scrollingContainer: Element): void;
    setNativeRange(startNode: Node | null, startOffset?: number, endNode?: Node, endOffset?: number, force?: boolean): void;
    setRange(range: Range | null, force: boolean, source?: EmitterSource): void;
    setRange(range: Range | null, source?: EmitterSource): void;
    update(source?: EmitterSource): void;
}
export { Range, Selection as default };
