import * as React from "react";
import { State, Borders, Location, keyCodes } from "../Common";
import { trySetDataAndAppendChange } from "../Functions/trySetDataAndAppendChange";
import { selectColumn } from "../Functions/selectRange";

export interface CellRendererProps {
    state: State
    location: Location,
    borders: Borders,
}

export const CellRenderer: React.FunctionComponent<CellRendererProps> = (props) => {
    const state = { ...props.state };
    const location = props.location;
    const cell = location.cell;
    const borders = props.borders;
    const isFocused = (state.focusedLocation !== undefined) && (state.focusedLocation.col.idx === props.location.col.idx && state.focusedLocation.row.idx === props.location.row.idx);
    const lastKeyCode = props.state.lastKeyCode;

    const style: React.CSSProperties = {
        ...state.cellTemplates[cell.type].customStyle,
        boxSizing: 'border-box',
        whiteSpace: 'nowrap',
        position: 'absolute',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden',
        left: location.col.left,
        top: location.row.top,
        width: location.col.width,
        height: location.row.height,
        // paddingLeft: 2,
        // paddingRight: 2,
        //borderTop: borders.top ? 'solid 1px #ccc' : '',
        //borderLeft: borders.left ? 'solid 1px #ccc' : '',
        // borderBottom: borders.bottom
        //     ? 'solid 1px #ccc'
        //     : 'solid 1px #e5e5e5',
        // borderRight: borders.right
        //     ? 'solid 1px #ccc'
        //     : 'solid 1px #e5e5e5',
        touchAction: isFocused ? 'none' : 'auto' // prevent scrolling
    }
    return (
        <div className="cell" style={style}>
            {
                state.cellTemplates[cell.type].renderContent({
                    cellData: state.cellTemplates[cell.type].validate(cell.data),
                    isInEditMode: false,
                    lastKeyCode: lastKeyCode,
                    onCellDataChanged: (newCellData) => {
                        const range = state.selectedRanges[state.activeSelectedRangeIdx];
                        const selectedCells = range.rows.flatMap(row => range.cols.map(col => row.cells[col.idx]));
                        console.log(selectedCells);
                        if (selectedCells.every(c => c.type === cell.type)) {
                            props.state.updateState(state => {
                                range.rows.forEach(row =>
                                    range.cols.forEach(col =>
                                        state = trySetDataAndAppendChange(state, new Location(row, col), cell.type, newCellData, '')
                                    )
                                );
                                return state;
                            })
                        }
                    }
                })
            }
        </div >
    )
}


