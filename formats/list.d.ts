import Block from '../blots/block';
import Container from '../blots/container';
declare class ListContainer extends Container {
}
declare class ListItem extends Block {
    static create(value: any): Element;
    static formats(domNode: any): any;
    static register(): void;
    constructor(scroll: any, domNode: any);
    format(name: any, value: any): void;
}
export { ListContainer, ListItem as default };
