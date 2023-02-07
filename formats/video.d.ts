import { BlockEmbed } from '../blots/block';
declare class Video extends BlockEmbed {
    static blotName: string;
    static className: string;
    static tagName: string;
    static create(value: any): Element;
    static formats(domNode: Element): {};
    static sanitize(url: string): string;
    static value(domNode: Element): string;
    domNode: HTMLVideoElement;
    format(name: any, value: any): void;
    html(): string;
}
export default Video;
