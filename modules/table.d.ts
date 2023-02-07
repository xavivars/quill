import Module from '../core/module';
import { TableCell, TableRow } from '../formats/table';
declare class Table extends Module {
    static register(): void;
    constructor(...args: any[]);
    balanceTables(): void;
    deleteColumn(): void;
    deleteRow(): void;
    deleteTable(): void;
    getTable(range?: import("../core/selection").Range): [null, null, null, -1] | [Table, TableRow, TableCell, number];
    insertColumn(offset: any): void;
    insertColumnLeft(): void;
    insertColumnRight(): void;
    insertRow(offset: any): void;
    insertRowAbove(): void;
    insertRowBelow(): void;
    insertTable(rows: any, columns: any): void;
    listenBalanceCells(): void;
}
export default Table;
