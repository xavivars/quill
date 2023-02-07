"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const quill_delta_1 = __importDefault(require("@reedsy/quill-delta"));
const quill_1 = __importDefault(require("../core/quill"));
const module_1 = __importDefault(require("../core/module"));
const table_1 = require("../formats/table");
class Table extends module_1.default {
    static register() {
        quill_1.default.register(table_1.TableCell);
        quill_1.default.register(table_1.TableRow);
        quill_1.default.register(table_1.TableBody);
        quill_1.default.register(table_1.TableContainer);
    }
    constructor(...args) {
        // @ts-expect-error
        super(...args);
        this.listenBalanceCells();
    }
    balanceTables() {
        // @ts-expect-error
        this.quill.scroll.descendants(table_1.TableContainer).forEach(table => {
            // @ts-expect-error
            table.balanceCells();
        });
    }
    deleteColumn() {
        const [table, , cell] = this.getTable();
        if (cell == null)
            return;
        // @ts-expect-error
        table.deleteColumn(cell.cellOffset());
        this.quill.update(quill_1.default.sources.USER);
    }
    deleteRow() {
        const [, row] = this.getTable();
        if (row == null)
            return;
        row.remove();
        this.quill.update(quill_1.default.sources.USER);
    }
    deleteTable() {
        const [table] = this.getTable();
        if (table == null)
            return;
        // @ts-expect-error
        const offset = table.offset();
        // @ts-expect-error
        table.remove();
        this.quill.update(quill_1.default.sources.USER);
        this.quill.setSelection(offset, quill_1.default.sources.SILENT);
    }
    getTable(range = this.quill.getSelection()) {
        if (range == null)
            return [null, null, null, -1];
        const [cell, offset] = this.quill.getLine(range.index);
        if (cell == null || cell.statics.blotName !== table_1.TableCell.blotName) {
            return [null, null, null, -1];
        }
        const row = cell.parent;
        const table = row.parent.parent;
        // @ts-expect-error
        return [table, row, cell, offset];
    }
    insertColumn(offset) {
        const range = this.quill.getSelection();
        const [table, row, cell] = this.getTable(range);
        if (cell == null)
            return;
        const column = cell.cellOffset();
        table.insertColumn(column + offset);
        this.quill.update(quill_1.default.sources.USER);
        let shift = row.rowOffset();
        if (offset === 0) {
            shift += 1;
        }
        this.quill.setSelection(range.index + shift, range.length, quill_1.default.sources.SILENT);
    }
    insertColumnLeft() {
        this.insertColumn(0);
    }
    insertColumnRight() {
        this.insertColumn(1);
    }
    insertRow(offset) {
        const range = this.quill.getSelection();
        const [table, row, cell] = this.getTable(range);
        if (cell == null)
            return;
        const index = row.rowOffset();
        table.insertRow(index + offset);
        this.quill.update(quill_1.default.sources.USER);
        if (offset > 0) {
            this.quill.setSelection(range, quill_1.default.sources.SILENT);
        }
        else {
            this.quill.setSelection(range.index + row.children.length, range.length, quill_1.default.sources.SILENT);
        }
    }
    insertRowAbove() {
        this.insertRow(0);
    }
    insertRowBelow() {
        this.insertRow(1);
    }
    insertTable(rows, columns) {
        const range = this.quill.getSelection();
        if (range == null)
            return;
        const delta = new Array(rows).fill(0).reduce(memo => {
            const text = new Array(columns).fill('\n').join('');
            return memo.insert(text, { table: (0, table_1.tableId)() });
        }, new quill_delta_1.default().retain(range.index));
        this.quill.updateContents(delta, quill_1.default.sources.USER);
        this.quill.setSelection(range.index, quill_1.default.sources.SILENT);
        this.balanceTables();
    }
    listenBalanceCells() {
        this.quill.on(quill_1.default.events.SCROLL_OPTIMIZE, mutations => {
            mutations.some(mutation => {
                if (['TD', 'TR', 'TBODY', 'TABLE'].includes(mutation.target.tagName)) {
                    this.quill.once(quill_1.default.events.TEXT_CHANGE, (delta, old, source) => {
                        if (source !== quill_1.default.sources.USER)
                            return;
                        this.balanceTables();
                    });
                    return true;
                }
                return false;
            });
        });
    }
}
exports.default = Table;
//# sourceMappingURL=table.js.map