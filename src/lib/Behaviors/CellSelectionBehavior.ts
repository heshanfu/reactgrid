import { focusLocation, PointerEvent } from '../Functions';
import { State, Location, Behavior } from '../Model';
import { selectRange, updateActiveSelectedRange } from '../Functions/selectRange';


export class CellSelectionBehavior extends Behavior {
    handlePointerDown(event: PointerEvent, location: Location, state: State): State {
        if (((event.target as HTMLDivElement).className === 'reactgrid')) return state;
        if (!state.disableRangeSelection && event.shiftKey && state.focusedLocation) {
            const range = state.cellMatrix.getRange(state.focusedLocation, location);
            if (event.ctrlKey && state.selectionMode === 'range') {
                return updateActiveSelectedRange(state, range);
            } else {
                return selectRange(state, range, false);
            }
        } else if (!state.disableRangeSelection && event.ctrlKey) {
            const pointedRangeIdx = state.selectedRanges.findIndex(range => range.contains(location));
            const pointedRange = state.selectedRanges[pointedRangeIdx];

            if (pointedRange) {
                state = focusLocation(state, location, false);
                state = { ...state, activeSelectedRangeIdx: pointedRangeIdx };
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
        if (((event.target as HTMLDivElement).className === 'reactgrid')) return state; // fix for FF scroll issue
        if (state.disableRangeSelection) {
            return state;
        } else if (state.selectionMode === 'range') {
            return updateActiveSelectedRange(state, range);
        } else {
            return selectRange(state, range, false);
        }
    }
}
