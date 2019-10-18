import * as React from 'react';
import { keyCodes } from '../Common/Constants';
import { CellRenderProps, CellTemplate, Cell } from '../Common';
import { isTextInput, isNavigationKey } from './keyCodeCheckings';

type EmailCell = Cell<'email', string, {}>;

export class EmailCellTemplate implements CellTemplate<EmailCell> {
    
    isValid(cell: EmailCell): boolean {
        const email_regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return email_regex.test(cell.data.replace(/\s+/g, ''));
    }

    toText(cell: EmailCell) {
        return cell.data;
    }

    handleKeyDown1(cellData: string, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean, props?: any) {
        if (!ctrl && !alt && isTextInput(keyCode)) return { cellData: '', enableEditMode: true };
        return { cellData, enableEditMode: keyCode === keyCodes.POINTER || keyCode === keyCodes.ENTER };
    }

    renderContent: (props: CellRenderProps<EmailCell>) => React.ReactNode = props => {
        if (!props.isInEditMode) return props.cell.data;
        return (
            <input
                type="email"
                style={{
                    width: '100%',
                    height: '100%',
                    padding: 0,
                    border: 0,
                    background: 'transparent',
                    fontSize: 14,
                    outline: 'none'
                }}
                ref={input => {
                    if (input) {
                        input.focus();
                        // input.setSelectionRange(input.value.length, input.value.length);
                    }
                }}
                defaultValue={props.cell.data}
                onChange={e => props.onCellChanged({...props.cell, data: e.currentTarget.value}, false)}
                onCopy={e => e.stopPropagation()}
                onCut={e => e.stopPropagation()}
                onPaste={e => e.stopPropagation()}
                onPointerDown={e => e.stopPropagation()}
                onKeyDown={e => {
                    if (isTextInput(e.keyCode) || isNavigationKey(e)) e.stopPropagation();
                    if (e.keyCode == keyCodes.ESC) e.currentTarget.value = props.cell.data; // reset
                }}
            />
        );
    };
}
