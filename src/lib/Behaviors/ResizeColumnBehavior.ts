import { GridColumn, Behavior, PointerLocation, State, PointerEvent, Direction } from '../Model';
import { focusLocation } from '../Functions';

export class ResizeColumnBehavior extends Behavior {
    // TODO min / max column with on column object
    private minColumnWidth: number = 40;
    private resizedColumn!: GridColumn;
    private initialLocation!: PointerLocation;
    autoScrollDirection: Direction = 'horizontal';

    handlePointerDown(event: PointerEvent, location: PointerLocation, state: State): State {
        this.initialLocation = location;
        this.resizedColumn = location.column;
        return state;
    }
    handlePointerMove(event: PointerEvent, location: PointerLocation, state: State): State {
        let linePosition;
        if (location.column.idx == this.resizedColumn.idx && location.cellX > this.minColumnWidth || location.column.idx > this.resizedColumn.idx) {
            linePosition = location.viewportX + state.viewportElement.scrollLeft;
        } else if (location.viewportX > state.cellMatrix.width - state.viewportElement.scrollLeft) {
            linePosition = location.viewportX;
        } else {
            let offset = 0;
            if (state.cellMatrix.scrollableRange.columns.map(c => c.idx).includes(this.resizedColumn.idx)) {
                offset = state.cellMatrix.frozenLeftRange.width;
            } else if (state.cellMatrix.frozenRightRange.columns.map(c => c.idx).includes(this.resizedColumn.idx)) {
                offset = Math.min(state.viewportElement.clientWidth, state.cellMatrix.width) - state.cellMatrix.frozenRightRange.width
            }
            linePosition = this.resizedColumn.left + this.minColumnWidth + offset + state.viewportElement.scrollLeft;
        }
        return { ...state, linePosition, lineOrientation: 'vertical' };
    }

    handlePointerUp(event: PointerEvent, location: PointerLocation, state: State): State {
        const newWidth = this.resizedColumn.width + location.viewportX - this.initialLocation.viewportX
        if (state.props.onColumnResized && newWidth >= this.minColumnWidth) {
            state.props.onColumnResized(this.initialLocation.column.columnId, newWidth)
        } else if (state.props.onColumnResized) {
            // TODO describe this
            state.props.onColumnResized(this.resizedColumn.columnId, this.minColumnWidth + state.viewportElement.scrollLeft);
        }
        let focusedLocation = state.focusedLocation;
        if (focusedLocation !== undefined && this.resizedColumn.columnId === focusedLocation.column.idx) {
            const column = { ...focusedLocation.column, width: newWidth };
            focusedLocation = { ...focusedLocation, column };
        }
        return { ...state, linePosition: -1, focusedLocation };
    }
}