import * as React from 'react';
import { keyCodes } from '../Common/Constants';
import { CellRenderProps, CellTemplate, Cell } from '../Common';
import { isNumberInput, isNavigationKey } from './keyCodeCheckings'

type NumberCell = Cell<'number', number, {}>

export class NumberCellTemplate implements CellTemplate<NumberCell> {

    isValid(cell: NumberCell): boolean {
        return typeof (cell.data) === 'number';
    }

    textToCellData(text: string): number {
        return parseFloat(text);
    }

    toText(cell: NumberCell): string {
        return isNaN(cell.data) ? '' : cell.data.toString();
    }

    handleKeyDown(cell: NumberCell, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean) {
        if (!ctrl && !alt && !shift && isNumberInput(keyCode))
            return { cell: {...cell, data: NaN }, enableEditMode: true }
        return { cell, enableEditMode: keyCode === keyCodes.POINTER || keyCode === keyCodes.ENTER }
    }

    renderContent: (props: CellRenderProps<NumberCell>) => React.ReactNode = (props) => {
        if (!props.isInEditMode) {
            return this.toText(props.cell);
        }

        return <input
            style={{
                width: '100%',
                height: '100%',
                padding: 0,
                border: 0,
                background: 'transparent',
                fontSize: 14,
                outline: 'none',
            }}
            ref={input => {
                if (input) {
                    input.focus();
                    input.setSelectionRange(input.value.length, input.value.length);
                }
            }}
            value={this.toText(props.cell)}
            onChange={e => props.onCellChanged({...props.cell, data: parseFloat(e.currentTarget.value)}, false)}
            onKeyDown={e => {
                if (isNumberInput(e.keyCode) || isNavigationKey(e)) e.stopPropagation();
                if (e.keyCode == keyCodes.ESC) e.currentTarget.value = props.cell.data.toString(); // reset
            }}
            onCopy={e => e.stopPropagation()}
            onCut={e => e.stopPropagation()}
            onPaste={e => e.stopPropagation()}
            onPointerDown={e => e.stopPropagation()}
        />
    }
}