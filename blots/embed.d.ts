import { EmbedBlot } from 'parchment';
declare class Embed extends EmbedBlot {
    contentNode: HTMLSpanElement;
    leftGuard: Text;
    rightGuard: Text;
    constructor(scroll: any, node: any);
    index(node: any, offset: any): number;
    restore(node: any): any;
    update(mutations: any, context: any): void;
}
export default Embed;
