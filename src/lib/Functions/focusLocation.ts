import { State, Location } from '../Model';
import { scrollIntoView } from './scrollIntoView';
import { tryAppendChange } from './tryAppendChange';
import { getCompatibleCellAndTemplate } from './getCompatibleCellAndTemplate';

export function focusLocation(state: State, location: Location, resetSelection = true): State {
    // TODO scroll into view after changing state !?
    scrollIntoView(state, location);
    // TODO external event needed?
    // TODO move resetSelection out to an other function
    if (state.focusedLocation && state.currentlyEditedCell) {
        state = tryAppendChange(state, state.focusedLocation, state.currentlyEditedCell);
    }

    const { cell, cellTemplate } = getCompatibleCellAndTemplate(state, location);
    const isFocusable = !cellTemplate.isFocusable || cellTemplate.isFocusable(cell);

    if (!isFocusable)
        return state;

    state.props.onFocusLocationChanged && state.props.onFocusLocationChanged({ rowId: location.row.rowId, columnId: location.column.columnId });

    if (resetSelection)
        state = {
            ...state,
            activeSelectedRangeIdx: 0,
            selectedRanges: [state.cellMatrix.getRange(location, location)],
            selectedIndexes: [],
            selectedIds: [],
            selectionMode: 'range'
        };

    return {
        ...state,
        contextMenuPosition: { top: -1, left: -1 }, // TODO disable in derived state from props
        focusedLocation: location,
        currentlyEditedCell: undefined // TODO disable in derived state from props
    };
}
