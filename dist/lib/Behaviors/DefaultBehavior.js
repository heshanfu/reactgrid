var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { Behavior } from "../Model";
import { handleKeyDown } from "../Functions/handleKeyDown";
import { CellSelectionBehavior } from "./CellSelectionBehavior";
import { ColumnSelectionBehavior } from "./ColumnSelectionBehavior";
import { ColumnReorderBehavior } from "./ColumnReorderBehavior";
import { RowSelectionBehavior } from "./RowSelectionBehavior";
import { RowReorderBehavior } from "./RowReorderBehavior";
import { getActiveSelectedRange } from "../Functions/getActiveSelectedRange";
import { keyCodes, tryAppendChange, emptyCell } from "../Functions";
import { FillHandleBehavior } from "./FillHandleBehavior";
import { getLocationFromClient, focusLocation } from "../Functions";
import { ResizeColumnBehavior } from "./ResizeColumnBehavior";
import { getCompatibleCellAndTemplate } from '../Functions/getCompatibleCellAndTemplate';
import { areLocationsEqual } from '../Functions/areLocationsEqual';
var DefaultBehavior = (function (_super) {
    __extends(DefaultBehavior, _super);
    function DefaultBehavior() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DefaultBehavior.prototype.handlePointerDown = function (event, location, state) {
        state = __assign({}, state, { currentBehavior: this.getNewBehavior(event, location, state), contextMenuPosition: { top: -1, left: -1 } });
        return state.currentBehavior.handlePointerDown(event, location, state);
    };
    DefaultBehavior.prototype.getNewBehavior = function (event, location, state) {
        if (event.pointerType === 'mouse' && location.row.idx == 0 && location.cellX > location.column.width - 7 && location.column.resizable) {
            return new ResizeColumnBehavior();
        }
        else if (state.enableColumnSelection && location.row.idx == 0 && state.selectedIds.includes(location.column.columnId) && !event.ctrlKey && state.selectionMode == 'column' && location.column.reorderable) {
            return new ColumnReorderBehavior();
        }
        else if (state.enableColumnSelection && location.row.idx == 0 && (event.target.className !== 'rg-fill-handle' && event.target.className !== 'rg-touch-fill-handle')) {
            return new ColumnSelectionBehavior();
        }
        else if (state.enableRowSelection && location.column.idx == 0 && state.selectedIds.includes(location.row.rowId) && !event.ctrlKey && state.selectionMode == 'row' && location.row.reorderable) {
            return new RowReorderBehavior();
        }
        else if (state.enableRowSelection && location.column.idx == 0 && (event.target.className !== 'rg-fill-handle' && event.target.className !== 'rg-touch-fill-handle')) {
            return new RowSelectionBehavior();
        }
        else if ((event.pointerType === 'mouse' || event.pointerType === undefined) && event.target.className === 'rg-fill-handle' && !state.disableFillHandle) {
            return new FillHandleBehavior();
        }
        else {
            return new CellSelectionBehavior();
        }
    };
    DefaultBehavior.prototype.handleContextMenu = function (event, state) {
        event.preventDefault();
        var clickX = event.clientX;
        var clickY = event.clientY;
        var top = window.innerHeight - clickY > 25;
        var right = window.innerWidth - clickX > 120;
        var bottom = !top;
        var left = !right;
        var contextMenuPosition = state.contextMenuPosition;
        if (top) {
            contextMenuPosition.top = clickY;
        }
        if (right) {
            contextMenuPosition.left = clickX + 5;
        }
        if (bottom) {
            contextMenuPosition.top = clickY - 25 - 5;
        }
        if (left) {
            contextMenuPosition.left = clickX - 120 - 5;
        }
        var focusedLocation = getLocationFromClient(state, clickX, clickY);
        if (!state.selectedRanges.find(function (range) { return range.contains(focusedLocation); })) {
            state = focusLocation(state, focusedLocation);
        }
        return __assign({}, state, { contextMenuPosition: contextMenuPosition });
    };
    DefaultBehavior.prototype.handleDoubleClick = function (event, location, state) {
        if (areLocationsEqual(location, state.focusedLocation)) {
            var _a = getCompatibleCellAndTemplate(state, location), cell = _a.cell, cellTemplate = _a.cellTemplate;
            if (cellTemplate.handleKeyDown) {
                var _b = cellTemplate.handleKeyDown(cell, 1, event.ctrlKey, event.shiftKey, event.altKey), newCell = _b.cell, enableEditMode = _b.enableEditMode;
                if (enableEditMode) {
                    return __assign({}, state, { currentlyEditedCell: newCell });
                }
            }
        }
        return state;
    };
    DefaultBehavior.prototype.handleKeyDown = function (event, state) {
        return handleKeyDown(state, event);
    };
    DefaultBehavior.prototype.handleKeyUp = function (event, state) {
        if (event.keyCode === keyCodes.TAB || event.keyCode === keyCodes.ENTER) {
            event.preventDefault();
            event.stopPropagation();
        }
        return state;
    };
    DefaultBehavior.prototype.handleCopy = function (event, state) {
        copySelectedRangeToClipboard(state);
        event.preventDefault();
        return state;
    };
    DefaultBehavior.prototype.handlePaste = function (event, state) {
        var activeSelectedRange = getActiveSelectedRange(state);
        if (!activeSelectedRange) {
            return state;
        }
        var pastedRows = [];
        var htmlData = event.clipboardData.getData('text/html');
        var document = new DOMParser().parseFromString(htmlData, 'text/html');
        if (htmlData && document.body.firstElementChild.getAttribute('data-reactgrid') === 'reactgrid') {
            var tableRows = document.body.firstElementChild.firstElementChild.children;
            for (var ri = 0; ri < tableRows.length; ri++) {
                var row = [];
                for (var ci = 0; ci < tableRows[ri].children.length; ci++) {
                    var rawData = tableRows[ri].children[ci].getAttribute('data-reactgrid');
                    var data = rawData && JSON.parse(rawData);
                    row.push(data ? data : { type: 'text', text: tableRows[ri].children[ci].innerHTML });
                }
                pastedRows.push(row);
            }
        }
        else {
            pastedRows = event.clipboardData.getData('text/plain').split('\n').map(function (line) { return line.split('\t').map(function (t) { return ({ type: 'text', text: t, value: parseFloat(t) }); }); });
        }
        event.preventDefault();
        return __assign({}, pasteData(state, pastedRows));
    };
    DefaultBehavior.prototype.handleCut = function (event, state) {
        copySelectedRangeToClipboard(state, true);
        event.preventDefault();
        return __assign({}, state);
    };
    return DefaultBehavior;
}(Behavior));
export { DefaultBehavior };
export function pasteData(state, rows) {
    var activeSelectedRange = getActiveSelectedRange(state);
    if (rows.length === 1 && rows[0].length === 1) {
        activeSelectedRange.rows.forEach(function (row) {
            return activeSelectedRange.columns.forEach(function (column) {
                state = tryAppendChange(state, { row: row, column: column }, rows[0][0]);
            });
        });
    }
    else {
        var lastLocation_1;
        var cellMatrix_1 = state.cellMatrix;
        rows.forEach(function (row, ri) {
            return row.forEach(function (cell, ci) {
                var rowIdx = activeSelectedRange.first.row.idx + ri;
                var columnIdx = activeSelectedRange.first.column.idx + ci;
                if (rowIdx <= cellMatrix_1.last.row.idx && columnIdx <= cellMatrix_1.last.column.idx) {
                    lastLocation_1 = cellMatrix_1.getLocation(rowIdx, columnIdx);
                    state = tryAppendChange(state, lastLocation_1, cell);
                }
            });
        });
        return __assign({}, state, { selectedRanges: [cellMatrix_1.getRange(activeSelectedRange.first, lastLocation_1)], activeSelectedRangeIdx: 0 });
    }
    return state;
}
export function copySelectedRangeToClipboard(state, removeValues) {
    if (removeValues === void 0) { removeValues = false; }
    var activeSelectedRange = getActiveSelectedRange(state);
    if (!activeSelectedRange)
        return;
    var div = document.createElement('div');
    var table = document.createElement('table');
    table.setAttribute('empty-cells', 'show');
    table.setAttribute('data-reactgrid', 'reactgrid');
    activeSelectedRange.rows.forEach(function (row) {
        var tableRow = table.insertRow();
        activeSelectedRange.columns.forEach(function (column) {
            var tableCell = tableRow.insertCell();
            var cell = getCompatibleCellAndTemplate(state, { row: row, column: column }).cell;
            tableCell.textContent = cell.text;
            tableCell.setAttribute('data-reactgrid', JSON.stringify(cell));
            tableCell.style.border = '1px solid #D3D3D3';
            if (removeValues) {
                state = tryAppendChange(state, { row: row, column: column }, emptyCell);
            }
        });
    });
    div.setAttribute('contenteditable', 'true');
    div.appendChild(table);
    document.body.appendChild(div);
    div.focus();
    document.execCommand('selectAll', false, undefined);
    document.execCommand('copy');
    document.body.removeChild(div);
    state.hiddenFocusElement.focus();
}
export function copySelectedRangeToClipboardInIE(state, removeValues) {
    if (removeValues === void 0) { removeValues = false; }
}
