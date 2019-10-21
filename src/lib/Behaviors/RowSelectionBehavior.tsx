import { focusLocation } from '../Functions';
import { State, Location, Behavior, Direction } from '../Model';
import { PointerEvent } from '../Model/domEvents';
import { selectOneRow, selectMultipleRows, unSelectOneRow } from '../Functions/selectRange';

export class RowSelectionBehavior extends Behavior {
    autoScrollDirection: Direction = 'vertical';

    handlePointerDown(event: PointerEvent, location: Location, state: State): State {
        if (event.ctrlKey && state.selectionMode === 'row' && state.selectedIds.some(id => id === location.row.rowId)) {
            state = unSelectOneRow(state, location.row);
        } else if (event.shiftKey && state.focusedLocation) {
            state = selectMultipleRows(state, state.focusedLocation!.row, location.row, event.ctrlKey);
        } else {
            state = focusLocation(state, location, state.disableRowSelection);
            if (!state.disableRowSelection)
                state = selectOneRow(state, location.row, event.ctrlKey);
        }
        return state;
    }

    handlePointerEnter(event: PointerEvent, location: Location, state: State): State {
        if (state.disableRowSelection)
            return focusLocation(state, location);
        else
            return selectMultipleRows(state, state.focusedLocation!.row, location.row, event.ctrlKey);
    }
}