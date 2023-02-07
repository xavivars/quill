"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tableId = exports.TableContainer = exports.TableBody = exports.TableRow = exports.TableCell = void 0;
const block_1 = __importDefault(require("../blots/block"));
const container_1 = __importDefault(require("../blots/container"));
class TableCell extends block_1.default {
    static create(value) {
        // @ts-expect-error
        const node = super.create();
        if (value) {
            node.setAttribute('data-row', value);
        }
        else {
            node.setAttribute('data-row', tableId());
        }
        return node;
    }
    static formats(domNode) {
        if (domNode.hasAttribute('data-row')) {
            return domNode.getAttribute('data-row');
        }
        return undefined;
    }
    cellOffset() {
        if (this.parent) {
            return this.parent.children.indexOf(this);
        }
        return -1;
    }
    format(name, value) {
        if (name === TableCell.blotName && value) {
            this.domNode.setAttribute('data-row', value);
        }
        else {
            super.format(name, value);
        }
    }
    row() {
        return this.parent;
    }
    rowOffset() {
        if (this.row()) {
            return this.row().rowOffset();
        }
        return -1;
    }
    table() {
        return this.row() && this.row().table();
    }
}
exports.TableCell = TableCell;
TableCell.blotName = 'table';
TableCell.tagName = 'TD';
class TableRow extends container_1.default {
    checkMerge() {
        if (super.checkMerge() && this.next.children.head != null) {
            const thisHead = this.children.head.formats();
            const thisTail = this.children.tail.formats();
            const nextHead = this.next.children.head.formats();
            const nextTail = this.next.children.tail.formats();
            return (thisHead.table === thisTail.table &&
                thisHead.table === nextHead.table &&
                thisHead.table === nextTail.table);
        }
        return false;
    }
    optimize(...args) {
        // @ts-expect-error
        super.optimize(...args);
        this.children.forEach(child => {
            if (child.next == null)
                return;
            const childFormats = child.formats();
            const nextFormats = child.next.formats();
            if (childFormats.table !== nextFormats.table) {
                const next = this.splitAfter(child);
                if (next) {
                    // @ts-expect-error TODO: parameters of optimize() should be a optional
                    next.optimize();
                }
                // We might be able to merge with prev now
                if (this.prev) {
                    // @ts-expect-error TODO: parameters of optimize() should be a optional
                    this.prev.optimize();
                }
            }
        });
    }
    rowOffset() {
        if (this.parent) {
            return this.parent.children.indexOf(this);
        }
        return -1;
    }
    table() {
        return this.parent && this.parent.parent;
    }
}
exports.TableRow = TableRow;
TableRow.blotName = 'table-row';
TableRow.tagName = 'TR';
class TableBody extends container_1.default {
}
exports.TableBody = TableBody;
TableBody.blotName = 'table-body';
TableBody.tagName = 'TBODY';
class TableContainer extends container_1.default {
    balanceCells() {
        // @ts-expect-error TODO: fix signature of ParentBlot.descendants
        const rows = this.descendants(TableRow);
        const maxColumns = rows.reduce((max, row) => {
            return Math.max(row.children.length, max);
        }, 0);
        rows.forEach(row => {
            new Array(maxColumns - row.children.length).fill(0).forEach(() => {
                let value;
                if (row.children.head != null) {
                    value = TableCell.formats(row.children.head.domNode);
                }
                const blot = this.scroll.create(TableCell.blotName, value);
                row.appendChild(blot);
                // @ts-expect-error TODO: parameters of optimize() should be a optional
                blot.optimize(); // Add break blot
            });
        });
    }
    cells(column) {
        return this.rows().map(row => row.children.at(column));
    }
    deleteColumn(index) {
        // @ts-expect-error
        const [body] = this.descendant(TableBody);
        if (body == null || body.children.head == null)
            return;
        body.children.forEach(row => {
            const cell = row.children.at(index);
            if (cell != null) {
                cell.remove();
            }
        });
    }
    insertColumn(index) {
        // @ts-expect-error
        const [body] = this.descendant(TableBody);
        if (body == null || body.children.head == null)
            return;
        body.children.forEach(row => {
            const ref = row.children.at(index);
            const value = TableCell.formats(row.children.head.domNode);
            const cell = this.scroll.create(TableCell.blotName, value);
            row.insertBefore(cell, ref);
        });
    }
    insertRow(index) {
        // @ts-expect-error
        const [body] = this.descendant(TableBody);
        if (body == null || body.children.head == null)
            return;
        const id = tableId();
        const row = this.scroll.create(TableRow.blotName);
        body.children.head.children.forEach(() => {
            const cell = this.scroll.create(TableCell.blotName, id);
            row.appendChild(cell);
        });
        const ref = body.children.at(index);
        body.insertBefore(row, ref);
    }
    rows() {
        const body = this.children.head;
        if (body == null)
            return [];
        return body.children.map(row => row);
    }
}
exports.TableContainer = TableContainer;
TableContainer.blotName = 'table-container';
TableContainer.tagName = 'TABLE';
TableContainer.allowedChildren = [TableBody];
TableBody.requiredContainer = TableContainer;
TableBody.allowedChildren = [TableRow];
TableRow.requiredContainer = TableBody;
TableRow.allowedChildren = [TableCell];
TableCell.requiredContainer = TableRow;
function tableId() {
    const id = Math.random().toString(36).slice(2, 6);
    return `row-${id}`;
}
exports.tableId = tableId;
//# sourceMappingURL=table.js.map