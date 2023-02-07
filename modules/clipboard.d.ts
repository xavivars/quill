import { ScrollBlot } from 'parchment';
import Delta from '@reedsy/quill-delta';
import { EmitterSource } from '../core/emitter';
import Module from '../core/module';
import Quill from '../core/quill';
import { Range } from '../core/selection';
declare type Selector = string | Node['TEXT_NODE'] | Node['ELEMENT_NODE'];
declare type Matcher = (node: Node, delta: Delta, scroll: ScrollBlot) => Delta;
interface ClipboardOptions {
    matchers: [Selector, Matcher][];
}
declare class Clipboard extends Module<ClipboardOptions> {
    matchers: [Selector, Matcher][];
    constructor(quill: Quill, options: Partial<ClipboardOptions>);
    addMatcher(selector: Selector, matcher: Matcher): void;
    convert({ html, text }: {
        html?: string;
        text?: string;
    }, formats?: Record<string, unknown>): any;
    convertHTML(html: string): any;
    dangerouslyPasteHTML(index: number, html: string, source?: EmitterSource): void;
    onCaptureCopy(e: ClipboardEvent, isCut?: boolean): void;
    onCapturePaste(e: ClipboardEvent): void;
    onCopy(range: Range, isCut: boolean): {
        html: string;
        text: string;
    };
    onPaste(range: Range, { text, html }: {
        text: string;
        html: string;
    }): void;
    prepareMatching(container: Element, nodeMatches: WeakMap<Node, Matcher[]>): any[][];
}
declare function traverse(scroll: ScrollBlot, node: ChildNode, elementMatchers: Matcher[], textMatchers: Matcher[], nodeMatches: WeakMap<Node, Matcher[]>): any;
declare function matchAttributor(node: HTMLElement, delta: Delta, scroll: ScrollBlot): Delta;
declare function matchBlot(node: Node, delta: Delta, scroll: ScrollBlot): Delta;
declare function matchNewline(node: Node, delta: Delta, scroll: ScrollBlot): Delta;
declare function matchText(node: any, delta: any, scroll: any): any;
export { Clipboard as default, matchAttributor, matchBlot, matchNewline, matchText, traverse, };
