import { focusLocation } from '../Functions';
import { State, Location, Behavior } from '../Common';
import { PointerEvent } from "../Common/domEvents";
import { selectRange, updateActiveSelectedRange } from '../Functions/selectRange';

export class CellSelectionBehavior extends Behavior {

    handlePointerDown(event: PointerEvent, location: Location, state: State): State {
        if (event.shiftKey && state.focusedLocation) {
            const range = state.cellMatrix.getRange(state.focusedLocation, location);
            if (event.ctrlKey && state.selectionMode === 'range') {
                return updateActiveSelectedRange(state, range);
            } else {
                return selectRange(state, range, false);
            }

        } else if (event.ctrlKey) {
            const pointedRange = state.selectedRanges.find(range => range.contains(location));
            const pointedRangeIdx = state.selectedRanges.findIndex(range => range.contains(location));

            if (pointedRange) {
                state = focusLocation(state, location, false);
                state = { ...state, activeSelectedRangeIdx: pointedRangeIdx }
            } else {
                const range = state.cellMatrix.getRange(location, location);
                state = selectRange(state, range, true);
                state = focusLocation(state, location, false);
            }
        } else {
            state = focusLocation(state, location);
        }
        return state;
    }

    handlePointerEnter(event: PointerEvent, location: Location, state: State): State {
        const range = state.cellMatrix.getRange(state.focusedLocation!, location);
        if (state.selectionMode === 'range') {
            return updateActiveSelectedRange(state, range);
        } else {
            return selectRange(state, range, false);
        }
    }

    handleDoubleClick(event: PointerEvent, location: Location, state: State): State {
        if (state.isFocusedCellInEditMode /*|| this.grid.state.isFocusedCellReadOnly*/) {
            event.preventDefault();
            event.stopPropagation();
        } else if (location.equals(state.focusedLocation)) {
            return { ...state, isFocusedCellInEditMode: state.cellTemplates[state.focusedLocation!.cell.type].handleKeyDown(1, state.focusedLocation!.cell.data).editable };
        }
        return state;
    }
}