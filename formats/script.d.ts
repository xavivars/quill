import Inline from '../blots/inline';
declare class Script extends Inline {
    static blotName: string;
    static tagName: string[];
    static create(value: any): Node;
    static formats(domNode: any): "sub" | "super";
}
export default Script;
