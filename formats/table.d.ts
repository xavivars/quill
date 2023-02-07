import LinkedList from 'parchment/dist/typings/collection/linked-list';
import Block from '../blots/block';
import Container from '../blots/container';
declare class TableCell extends Block {
    static blotName: string;
    static tagName: string;
    static create(value: any): Element;
    static formats(domNode: any): any;
    next: this | null;
    cellOffset(): number;
    format(name: any, value: any): void;
    row(): TableRow;
    rowOffset(): number;
    table(): import("parchment/dist/typings/blot/abstract/blot").Parent;
}
declare class TableRow extends Container {
    static blotName: string;
    static tagName: string;
    children: LinkedList<TableCell>;
    next: this | null;
    checkMerge(): boolean;
    optimize(...args: any[]): void;
    rowOffset(): number;
    table(): import("parchment/dist/typings/blot/abstract/blot").Parent;
}
declare class TableBody extends Container {
    static blotName: string;
    static tagName: string;
    children: LinkedList<TableRow>;
}
declare class TableContainer extends Container {
    static blotName: string;
    static tagName: string;
    children: LinkedList<TableBody>;
    balanceCells(): void;
    cells(column: number): any[];
    deleteColumn(index: number): void;
    insertColumn(index: number): void;
    insertRow(index: number): void;
    rows(): any[];
}
declare function tableId(): string;
export { TableCell, TableRow, TableBody, TableContainer, tableId };
