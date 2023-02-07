import { EmbedBlot } from 'parchment';
declare class Image extends EmbedBlot {
    static blotName: string;
    static tagName: string;
    static create(value: any): Element;
    static formats(domNode: Element): {};
    static match(url: string): boolean;
    static register(): void;
    static sanitize(url: string): string;
    static value(domNode: Element): string;
    domNode: HTMLImageElement;
    format(name: any, value: any): void;
}
export default Image;
