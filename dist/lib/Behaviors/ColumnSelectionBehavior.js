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
import { focusLocation } from '../Functions';
import { Behavior } from '../Model';
import { selectOneColumn, selectMultipleColumns, unSelectOneColumn } from '../Functions/selectRange';
var ColumnSelectionBehavior = (function (_super) {
    __extends(ColumnSelectionBehavior, _super);
    function ColumnSelectionBehavior() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.autoScrollDirection = 'horizontal';
        return _this;
    }
    ColumnSelectionBehavior.prototype.handlePointerDown = function (event, location, state) {
        if (event.ctrlKey && state.selectionMode === 'column' && state.selectedIds.some(function (id) { return id === location.column.columnId; })) {
            state = unSelectOneColumn(state, location.column);
        }
        else if (event.shiftKey && state.focusedLocation) {
            state = selectMultipleColumns(state, state.focusedLocation.column, location.column, event.ctrlKey);
        }
        else {
            state = focusLocation(state, location, false);
            state = selectOneColumn(state, location.column, event.ctrlKey);
        }
        return state;
    };
    ColumnSelectionBehavior.prototype.handlePointerEnter = function (event, location, state) {
        return selectMultipleColumns(state, state.focusedLocation.column, location.column, event.ctrlKey);
    };
    return ColumnSelectionBehavior;
}(Behavior));
export { ColumnSelectionBehavior };