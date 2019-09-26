import * as React from "react";
import { State, keyCodes, Location } from "../Common";
import { trySetDataAndAppendChange } from "../Functions";
import { isBrowserIE } from "../Functions";

interface CellEditorProps {
    state: State;
}

export const CellEditor: React.FunctionComponent<CellEditorProps> = props => {
    const [cell, setCell] = React.useState(props.state.currentlyEditedCell!);
    const location = props.state.focusedLocation!;
    const [position, setPosition] = React.useState(calculatedEditorPosition(location, props.state));
    const cellType = props.state.cellTemplates[cell.type] ? cell.type : 'text';
    React.useEffect(() => setPosition(calculatedEditorPosition(location, props.state)), []);
    let lastKeyCode = 0;

    // TODO https://github.com/silevis/reactgrid/issues/33
    if (isBrowserIE()) {
        props.state.hiddenFocusElement.focus();
    }

    return (
        <div
            style={{
                boxSizing: 'border-box',
                position: 'absolute',
                top: position.top - 1,
                left: position.left - 1,
                height: location.row.height + 1,
                width: location.col.width + 1,
                paddingTop: 1,
                border: '2px #3579f8 solid',
                background: 'white',
                boxShadow: '1px 1px 6px rgba(0, 0, 0, 0.2)',
                zIndex: 5
            }}
            onBlur={() => { if (lastKeyCode !== keyCodes.ESC) props.state.updateState(state => trySetDataAndAppendChange(state, location, cell)) }}
            onKeyDown={e => {
                lastKeyCode = e.keyCode;
                // TODO descirbe reason for this
                if (e.keyCode !== keyCodes.ENTER && e.keyCode !== keyCodes.ESC && e.keyCode !== keyCodes.TAB) {
                    e.stopPropagation();
                }
            }}
        >
            {props.state.cellTemplates[cellType].renderContent({
                cellData: cell.data,
                isInEditMode: true,
                onCellDataChanged: (cellData) => { setCell({ data: cellData, type: cellType }) }
            })}
        </div>
    )
}

const calculatedXAxisOffset = (location: Location, state: State) => {
    if (state.cellMatrix.frozenRightRange.first.col && location.col.idx >= state.cellMatrix.frozenRightRange.first.col.idx) {
        return Math.min(state.cellMatrix.width, state.viewportElement.clientWidth) - state.cellMatrix.frozenRightRange.width;
    } else if (location.col.idx > (state.cellMatrix.frozenLeftRange.last.col ? state.cellMatrix.frozenLeftRange.last.col.idx : state.cellMatrix.first.col.idx) ||
        location.col.idx == state.cellMatrix.last.col.idx) {
        return state.cellMatrix.frozenLeftRange.width - state.viewportElement.scrollLeft;
    }
    return 0;
}

const calculatedYAxisOffset = (location: Location, state: State) => {
    if (state.cellMatrix.frozenBottomRange.first.row && location.row.idx >= state.cellMatrix.frozenBottomRange.first.row.idx) {
        return Math.min(state.cellMatrix.height, state.viewportElement.clientHeight) - state.cellMatrix.frozenBottomRange.height;
    } else if (location.row.idx > (state.cellMatrix.frozenTopRange.last.row ? state.cellMatrix.frozenTopRange.last.row.idx : state.cellMatrix.first.row.idx) ||
        location.row.idx == state.cellMatrix.last.row.idx) {
        return state.cellMatrix.frozenTopRange.height - state.viewportElement.scrollTop;
    }
    return 0;
}

const calculatedEditorPosition = (location: Location, state: State) => {
    return {
        left: location.col.left + calculatedXAxisOffset(location, state),
        top: location.row.top + calculatedYAxisOffset(location, state)
    }
}