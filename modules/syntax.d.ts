import { ScrollBlot } from 'parchment';
import Inline from '../blots/inline';
import Quill from '../core/quill';
import Module from '../core/module';
import CodeBlock from '../formats/code';
declare class CodeToken extends Inline {
    static formats(node: Element, scroll: ScrollBlot): any;
    constructor(scroll: ScrollBlot, domNode: Node, value: unknown);
    format(format: string, value: unknown): void;
    optimize(...args: any[]): void;
}
declare class SyntaxCodeBlock extends CodeBlock {
    static create(value: unknown): Node;
    static formats(domNode: Node): any;
    static register(): void;
    format(name: string, value: unknown): void;
    replaceWith(name: string, value: unknown): import("parchment/dist/typings/blot/abstract/blot").Blot;
}
interface SyntaxOptions {
    interval: number;
    languages: {
        key: string;
        label: string;
    }[];
}
declare class Syntax extends Module<SyntaxOptions> {
    static register(): void;
    languages: Record<string, true>;
    constructor(quill: Quill, options: Partial<SyntaxOptions>);
    initListener(): void;
    initTimer(): void;
    highlight(blot?: any, force?: boolean): void;
    highlightBlot(text: any, language?: string): any;
}
export { SyntaxCodeBlock as CodeBlock, CodeToken, Syntax as default };
