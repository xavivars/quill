import * as Parchment from 'parchment';
import { Blot, BlotConstructor } from 'parchment/dist/typings/blot/abstract/blot';
import Delta, { Op } from '@reedsy/quill-delta';
import Block, { BlockEmbed } from '../blots/block';
import Scroll from '../blots/scroll';
import Clipboard from '../modules/clipboard';
import History from '../modules/history';
import Keyboard from '../modules/keyboard';
import Uploader from '../modules/uploader';
import Editor from './editor';
import Emitter, { EmitterSource } from './emitter';
import Module from './module';
import Selection, { Range } from './selection';
import Theme, { ThemeConstructor } from './theme';
declare const globalRegistry: Parchment.Registry;
interface Options {
    theme?: string;
    debug?: string | boolean;
    registry?: Parchment.Registry;
    readOnly?: boolean;
    container?: HTMLElement;
    placeholder?: string;
    bounds?: HTMLElement | null;
    scrollingContainer?: HTMLElement | null;
    modules?: Record<string, unknown>;
}
interface ExpandedOptions extends Omit<Options, 'theme'> {
    theme: ThemeConstructor;
    registry: Parchment.Registry;
    container: HTMLElement;
    modules: Record<string, unknown>;
}
declare class Quill {
    static DEFAULTS: Partial<Options>;
    static events: {
        readonly EDITOR_CHANGE: "editor-change";
        readonly SCROLL_BEFORE_UPDATE: "scroll-before-update";
        readonly SCROLL_BLOT_MOUNT: "scroll-blot-mount";
        readonly SCROLL_BLOT_UNMOUNT: "scroll-blot-unmount";
        readonly SCROLL_OPTIMIZE: "scroll-optimize";
        readonly SCROLL_UPDATE: "scroll-update";
        readonly SCROLL_EMBED_UPDATE: "scroll-embed-update";
        readonly SELECTION_CHANGE: "selection-change";
        readonly TEXT_CHANGE: "text-change";
    };
    static sources: {
        readonly API: "api";
        readonly SILENT: "silent";
        readonly USER: "user";
    };
    static version: any;
    static imports: {
        delta: typeof Delta;
        parchment: typeof Parchment;
        'core/module': typeof Module;
        'core/theme': typeof Theme;
    };
    static debug(limit: string | boolean): void;
    static find(node: Node, bubble?: boolean): Quill | Blot;
    static import(name: 'core/module'): typeof Module;
    static import(name: 'parchment'): typeof Parchment;
    static import(name: 'delta'): typeof Delta;
    static import(name: string): unknown;
    static register(path: string | BlotConstructor | Parchment.Attributor | Record<string, unknown>, target?: BlotConstructor | Parchment.Attributor | boolean, overwrite?: boolean): void;
    scrollingContainer: HTMLElement;
    container: HTMLElement;
    root: HTMLDivElement;
    scroll: Scroll;
    emitter: Emitter;
    allowReadOnlyEdits: boolean;
    editor: Editor;
    selection: Selection;
    theme: Theme;
    keyboard: Keyboard;
    clipboard: Clipboard;
    history: History;
    uploader: Uploader;
    options: ExpandedOptions;
    constructor(container: HTMLElement, options?: Options);
    addContainer(container: string, refNode?: Node): HTMLDivElement;
    addContainer(container: HTMLElement, refNode?: Node): HTMLElement;
    blur(): void;
    deleteText(range: Range, source?: EmitterSource): Delta;
    deleteText(index: number, length: number, source?: EmitterSource): Delta;
    disable(): void;
    editReadOnly<T>(modifier: () => T): T;
    enable(enabled?: boolean): void;
    focus(): void;
    format(name: string, value: unknown, source?: EmitterSource): any;
    formatLine(index: number, length: number, formats: Record<string, unknown>, source?: EmitterSource): any;
    formatLine(index: number, length: number, name: string, value?: unknown, source?: EmitterSource): any;
    formatText(range: {
        index: number;
        length: number;
    }, name: string, value: unknown, source?: EmitterSource): Delta;
    formatText(index: number, length: number, name: string, value: unknown, source: EmitterSource): Delta;
    getBounds(index: any, length?: number): {
        bottom: number;
        height: any;
        left: number;
        right: number;
        top: number;
        width: any;
    };
    getContents(index?: number, length?: number): Delta;
    getFormat(index: number, length?: number): any;
    getFormat(range: {
        index: number;
        length: number;
    }): any;
    getIndex(blot: Blot): number;
    getLength(): number;
    getLeaf(index: number): [Parchment.LeafBlot, number];
    getLine(index: number): [Block | BlockEmbed, number];
    getLines(range: {
        index: number;
        length: number;
    }): (Block | BlockEmbed)[];
    getLines(index?: number, length?: number): (Block | BlockEmbed)[];
    getModule(name: string): unknown;
    getSelection(focus: true, source?: EmitterSource): Range;
    getSelection(focus?: boolean, source?: EmitterSource): Range | null;
    getSemanticHTML(range: {
        index: number;
        length: number;
    }): string;
    getSemanticHTML(index?: number, length?: number): string;
    getText(range: {
        index: number;
        length: number;
    }): string;
    getText(index: number, length?: number): string;
    hasFocus(): boolean;
    insertEmbed(index: number, embed: string, value: unknown, source?: EmitterSource): any;
    insertText(index: number, text: string, source: EmitterSource): Delta;
    insertText(index: number, text: string, name: string, value: unknown, source: EmitterSource): Delta;
    isEnabled(): boolean;
    off(...args: Parameters<typeof Emitter['prototype']['off']>): Emitter;
    on(event: typeof Emitter['events']['TEXT_CHANGE'], handler: (delta: Delta, oldContent: Delta, source: EmitterSource) => void): Emitter;
    on(event: typeof Emitter['events']['SELECTION_CHANGE'], handler: (range: Range, oldRange: Range, source: EmitterSource) => void): Emitter;
    on(event: typeof Emitter['events']['EDITOR_CHANGE'], handler: (...args: [typeof Emitter['events']['TEXT_CHANGE'], Delta, Delta, EmitterSource] | [
        typeof Emitter['events']['SELECTION_CHANGE'],
        Range,
        Range,
        EmitterSource
    ]) => void): Emitter;
    on(event: string, ...args: unknown[]): Emitter;
    once(...args: Parameters<typeof Emitter['prototype']['once']>): Emitter;
    removeFormat(...args: Parameters<typeof overload>): any;
    scrollIntoView(): void;
    setContents(delta: Delta | Op[], source?: EmitterSource): any;
    setSelection(range: Range | null, source?: EmitterSource): void;
    setSelection(index: number, source?: EmitterSource): void;
    setSelection(index: number, length?: number, source?: EmitterSource): void;
    setSelection(index: number, source?: EmitterSource): void;
    setText(text: string, source?: EmitterSource): any;
    update(source?: EmitterSource): void;
    updateContents(delta: Delta | Op[], source?: EmitterSource): any;
}
declare function expandConfig(container: HTMLElement, userConfig: Options): ExpandedOptions;
declare type NormalizedIndexLength = [
    number,
    number,
    Record<string, unknown>,
    EmitterSource
];
declare function overload(index: number, source?: EmitterSource): NormalizedIndexLength;
declare function overload(index: number, length: number, source?: EmitterSource): NormalizedIndexLength;
declare function overload(index: number, length: number, format: string, value: unknown, source?: EmitterSource): NormalizedIndexLength;
declare function overload(index: number, length: number, format: Record<string, unknown>, source?: EmitterSource): NormalizedIndexLength;
declare function overload(range: Range, source?: EmitterSource): NormalizedIndexLength;
declare function overload(range: Range, format: string, value: unknown, source?: EmitterSource): NormalizedIndexLength;
declare function overload(range: Range, format: Record<string, unknown>, source?: EmitterSource): NormalizedIndexLength;
export { globalRegistry, expandConfig, overload, Quill as default };
