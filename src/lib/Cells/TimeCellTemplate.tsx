import * as React from 'react';
import { keyCodes } from '../Common/Constants';
import { CellRenderProps, CellTemplate } from '../Common';

export class TimeCellTemplate implements CellTemplate<string> {
    validate(data: any): string {
        const time_regex = /^\d{2}\:\d{2}$/;
        data = data ? data.toString().replace(/\s+/g, '') : data;
        return (time_regex.test(data)) ? data : '';
    }

    textToCellData(text: string): string {
        return text;
    }

    cellDataToText(cellData: string) {
        return cellData;
    }

    handleKeyDown(keyCode: number, cellData: string) {
        return { editable: true, cellData }
    }

    customStyle: React.CSSProperties = {};

    renderContent: (props: CellRenderProps<string>) => React.ReactNode = (props) => {
        if (!props.isInEditMode)
            return props.cellData;
        const preserveValueKeyCodes = [0, keyCodes.ENTER];
        return <input
            type='time'
            style={{
                width: '100%',
                height: '100%',
                border: 0,
                fontSize: 16,
                outline: 'none'
            }}
            ref={input => {
                if (input) {
                    input.focus();
                    // input.setSelectionRange(input.value.length, input.value.length);
                }
            }}
            defaultValue={preserveValueKeyCodes.includes(props.lastKeyCode) ? props.cellData : ''}
            onChange={e => props.onCellDataChanged ? props.onCellDataChanged(e.currentTarget.value) : null}
            onCopy={e => e.stopPropagation()}
            onCut={e => e.stopPropagation()}
            onPaste={e => e.stopPropagation()}
            onPointerDown={e => e.stopPropagation()}
        />
    }
}
