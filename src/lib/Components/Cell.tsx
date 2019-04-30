import * as React from "react";
import { GridContext, Borders, Location } from "../Common";

export interface CellProps {
    gridContext: GridContext
    location: Location,
    borders: Borders,
}

export const Cell: React.SFC<CellProps> = (props) => {
    const state = props.gridContext.state;
    const borders = props.borders;
    const location = props.location;
    const cell = props.gridContext.cellMatrix.getCell(props.location);
    const isFocused = (state.focusedLocation !== undefined) && (state.focusedLocation.col.idx === props.location.col.idx && state.focusedLocation.row.idx === props.location.row.idx);
    const dynamicStyle: React.CSSProperties = isFocused
        ? {
            // marginLeft: isFirstCol ? 0 : -1, marginTop: isFirstRow ? 0 : -1,
            // paddingLeft: isFirstCol ? 0 : 1, paddingTop: isFirstRow ? 0 : 1,
            paddingLeft: 0,
            paddingRight: 0,
            border: 'solid 2px #3579f8'
        }
        : {
            paddingLeft: 2,
            paddingRight: 2,
            borderTop: borders.top ? 'solid 1px #CCC' : '',
            borderLeft: borders.left ? 'solid 1px #CCC' : '',
            borderBottom: borders.bottom
                ? 'solid 1px #CCC'
                : borders.bottom === undefined
                    ? 'solid 1px #E0E0E0'
                    : 'solid 1px #E0E0E0',
            borderRight: borders.right
                ? 'solid 1px #CCC'
                : borders.right === undefined
                    ? 'solid 1px #E0E0E0'
                    : 'solid 1px #E0E0E0'
        };

    return <>{cell.render({
        ...cell,
        gridContext: props.gridContext,
        cellKey: location.row.idx + '-' + location.col.idx,
        isInEditMode: isFocused && props.gridContext.state.isFocusedCellInEditMode,
        attributes: {
            style: {
                boxSizing: 'border-box',
                whiteSpace: 'nowrap',
                position: 'absolute',
                background: 'white',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                overflow: 'hidden',
                left: location.col.left,
                top: location.row.top,
                width: location.col.width,
                height: location.row.height,
                ...dynamicStyle
            }
        }

    })}</>
}
