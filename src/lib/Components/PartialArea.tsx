import * as React from 'react';
import { Range } from '../Model';

export interface PartialAreaProps {
    range: Range,
    pane: Range,
    style: React.CSSProperties
    class?: string
}

export const PartialArea: React.FunctionComponent<PartialAreaProps> = props => {
    const { range, pane, style } = props;
    const top = range.first.row.idx <= pane.first.row.idx ? pane.first.row.top : range.first.row.top;
    const left = range.first.column.idx <= pane.first.column.idx ? pane.first.column.left : range.first.column.left;
    const width = (range.last.column.idx > pane.last.column.idx ? pane.last.column.right : range.last.column.right) - left;
    const height = (range.last.row.idx > pane.last.row.idx ? pane.last.row.bottom : range.last.row.bottom) - top;
    const hasTopBorder = range.first.row.idx >= pane.first.row.idx;
    const hasBottomBorder = range.last.row.idx <= pane.last.row.idx;
    const hasRightBorder = range.last.column.idx <= pane.last.column.idx;
    const hasLeftBorder = range.first.column.idx >= pane.first.column.idx;
    return (
        <div
            className={`rg-partial-area ${props.class}`}
            key={range.first.column.idx + pane.last.column.idx}
            style={{
                ...style,
                top: top - (top === 0 ? 0 : 1),
                left: left - (left === 0 ? 0 : 1),
                width: width + (left === 0 ? 0 : 1),
                height: height + (top === 0 ? 0 : 1),
                borderTop: hasTopBorder ? undefined : 'unset',
                borderBottom: hasBottomBorder ? undefined : 'unset',
                borderRight: hasRightBorder ? undefined : 'unset',
                borderLeft: hasLeftBorder ? undefined : 'unset',
            }}
        />
    );
};
