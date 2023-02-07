import { ClassAttributor } from 'parchment';
declare class IndentAttributor extends ClassAttributor {
    add(node: any, value: any): boolean;
    canAdd(node: any, value: any): boolean;
    value(node: any): number;
}
declare const IndentClass: IndentAttributor;
export default IndentClass;
