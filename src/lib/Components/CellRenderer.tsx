import * as React from 'react';
import { State, Borders, Location } from '../Model';
import { tryAppendChange } from '../Functions';
import { ResizeHandle } from './ResizeHandle';
import { getCompatibleCellAndTemplate } from '../Functions/getCompatibleCellAndTemplate';
import { ColumnSelectionBehavior } from '../Behaviors/ColumnSelectionBehavior';
import { CellSelectionBehavior } from '../Behaviors/CellSelectionBehavior';

export interface CellRendererProps {
    state: State;
    location: Location;
    borders: Borders;
}

export const CellRenderer: React.FunctionComponent<CellRendererProps> = props => {
    const { cell, cellTemplate } = getCompatibleCellAndTemplate(props.state, props.location);
    const state = { ...props.state };
    const location = props.location;
    const isFocused = state.focusedLocation !== undefined && (state.focusedLocation.column.idx === props.location.column.idx && state.focusedLocation.row.idx === props.location.row.idx);
    const customClass = cellTemplate.getClassName ? cellTemplate.getClassName(cell, false) : '';

    // TODO custom style
    const style: React.CSSProperties = {
        ...(cellTemplate.getStyle && cellTemplate.getStyle(cell, false) || {}),
        left: location.column.left,
        top: location.row.top,
        width: location.column.width,
        height: location.row.height,
        // TODO when to prevent scrolling?
        touchAction: (isFocused || cell.type === 'header') ? 'none' : 'auto' // prevent scrolling
    };

    return (
        <div className={`rg-cell rg-${cell.type}-cell ${customClass}`} style={style} >
            {
                cellTemplate.render(cell, false, (cell, commit) => {
                    if (!commit) throw 'commit should be set to true in this case.';
                    props.state.update(state => tryAppendChange(state, location, cell));
                })
            }
            {location.row.idx === 0 && location.column.resizable && !(state.currentBehavior instanceof ColumnSelectionBehavior) && <ResizeHandle />}
        </div >
    );
};
