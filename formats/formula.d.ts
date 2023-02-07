import Embed from '../blots/embed';
declare class Formula extends Embed {
    static blotName: string;
    static className: string;
    static tagName: string;
    static create(value: any): Element;
    static value(domNode: Element): string;
    html(): string;
}
export default Formula;
