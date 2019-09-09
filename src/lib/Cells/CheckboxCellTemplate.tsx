import * as React from 'react';
import { keyCodes } from '../Common/Constants';
import { CellRenderProps as CellRenderProps, CellTemplate } from '../Common';

export class CheckboxCellTemplate implements CellTemplate<boolean> {
    readonly hasEditMode = false;

    validate(data: any): boolean {
        return (typeof (data) == typeof (true)) ? data : false;
    }

    textToCellData(text: string): boolean {
        return text === 'true';
    }

    cellDataToText(cellData: boolean) {
        return cellData ? 'true' : '';
    }

    handleKeyDown(keyCode: number, cellData: boolean) {
        if (keyCode == keyCodes.SPACE || keyCode == keyCodes.ENTER)
            cellData = !this.validate(cellData)
        return { editable: true, cellData }
    }

    customStyle: React.CSSProperties = {};

    renderContent: (props: CellRenderProps<boolean>) => React.ReactNode = (props) => {
        return <input
            type="checkbox"
            style={{
                width: '20px',
                height: '20px',
                marginLeft: 'auto',
                marginRight: 'auto',
                padding: 0,
                border: 0,
                background: 'transparent',
                pointerEvents: 'auto',
                zIndex: 1
            }}
            checked={props.cellData}
            onChange={() => { props.onCellDataChanged ? props.onCellDataChanged(!this.validate(props.cellData)) : null }}
        />
    }
}