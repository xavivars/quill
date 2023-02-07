import Block from '../blots/block';
import Inline from '../blots/inline';
import Container from '../blots/container';
declare class CodeBlockContainer extends Container {
    static create(value: any): Element;
    code(index: any, length: any): string;
    html(index: any, length: any): string;
}
declare class CodeBlock extends Block {
    static TAB: string;
    static register(): void;
}
declare class Code extends Inline {
}
export { Code, CodeBlockContainer, CodeBlock as default };
