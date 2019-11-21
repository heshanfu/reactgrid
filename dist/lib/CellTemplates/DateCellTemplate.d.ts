import * as React from 'react';
import { CellTemplate, Cell, Compatible, Uncertain, UncertainCompatible } from '../Model';
export interface DateCell extends Cell {
    type: 'date';
    date?: Date;
    format?: Intl.DateTimeFormat;
}
export declare class DateCellTemplate implements CellTemplate<DateCell> {
    getCompatibleCell(uncertainCell: Uncertain<DateCell>): Compatible<DateCell>;
    handleKeyDown(cell: Compatible<DateCell>, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean): {
        cell: Compatible<DateCell>;
        enableEditMode: boolean;
    };
    update(cell: Compatible<DateCell>, cellToMerge: UncertainCompatible<DateCell>): Compatible<DateCell>;
    render(cell: Compatible<DateCell>, isInEditMode: boolean, onCellChanged: (cell: Compatible<DateCell>, commit: boolean) => void): React.ReactNode;
}
