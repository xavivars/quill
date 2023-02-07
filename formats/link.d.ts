import Inline from '../blots/inline';
declare class Link extends Inline {
    static blotName: string;
    static tagName: string;
    static SANITIZED_URL: string;
    static PROTOCOL_WHITELIST: string[];
    static create(value: any): Element;
    static formats(domNode: any): any;
    static sanitize(url: string): string;
    format(name: any, value: any): void;
}
declare function sanitize(url: any, protocols: any): boolean;
export { Link as default, sanitize };
