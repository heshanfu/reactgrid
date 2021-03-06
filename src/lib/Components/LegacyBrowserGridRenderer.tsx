import * as React from 'react';
import { Line } from './Line';
import { Shadow } from './Shadow';
import { ContextMenu } from './ContextMenu';
import { MenuOption, State, PointerEvent, Id, Range, KeyboardEvent, ClipboardEvent, GridRendererProps } from '../Model';
import { CellEditor } from './CellEditor';
import { Pane } from './Pane';
import { getDataToPasteInIE, isBrowserIE } from '../Functions';
import { pasteData } from '../Behaviors/DefaultBehavior';
import { handleKeyDown } from '../Functions/handleKeyDown';

// interface LegacyBrowserGridRendererProps {
//     state: State;
//     viewportElementRefHandler: (viewportElement: HTMLDivElement) => void;
//     hiddenElementRefHandler: (hiddenFocusElement: HTMLInputElement) => void;
//     onKeyDown: (event: KeyboardEvent) => void;
//     onKeyUp: (event: KeyboardEvent) => void;
//     onCopy: (event: ClipboardEvent) => void;
//     onCut: (event: ClipboardEvent) => void;
//     onPaste: (event: ClipboardEvent) => void;
//     onPointerDown: (event: PointerEvent) => void;
//     onContextMenu: (event: PointerEvent) => void;
//     onRowContextMenu?: (menuOptions: MenuOption[]) => MenuOption[];
//     onColumnContextMenu?: (menuOptions: MenuOption[]) => MenuOption[];
//     onRangeContextMenu?: (menuOptions: MenuOption[]) => MenuOption[];
// }

export class LegacyBrowserGridRenderer extends React.Component<GridRendererProps> {
    private frozenTopScrollableElement!: HTMLDivElement;
    private frozenRightScrollableElement!: HTMLDivElement;
    private frozenBottomScrollableElement!: HTMLDivElement;
    private frozenLeftScrollableElement!: HTMLDivElement;

    render() {
        const { eventHandlers, state } = this.props;
        const cellMatrix = state.cellMatrix;
        const hiddenScrollableElement = state.hiddenScrollableElement;
        return (
            <div
                className="reactgrid-legacy-browser"
                //onCopy={(e: ClipboardEvent) => isBrowserIE() ? copySelectedRangeToClipboardInIE(state) : props.onCopy(e)}
                // onCut={(e: ClipboardEvent) => isBrowserIE() ? copySelectedRangeToClipboardInIE(state, true) : props.onCut(e)}
                // TODO
                //onPaste={(e: ClipboardEvent) => isBrowserIE() ? state.update((state: State) => pasteData(state, getDataToPasteInIE())) : props.onPaste(e)}

                onKeyDown={eventHandlers.keyDownHandler}
                onKeyUp={eventHandlers.keyUpHandler}
                onPointerDown={eventHandlers.pointerDownHandler}
            >
                <div
                    ref={(hiddenScrollableElement: HTMLDivElement) => hiddenScrollableElement && this.hiddenScrollableElementRefHandler(state, hiddenScrollableElement)}
                    // TODO this div is not hidden. 
                    className="rg-hidden-scrollable-element"
                    style={{
                        // TODO only 'auto' should be fine
                        overflowX: this.isHorizontalScrollbarVisible() ? 'scroll' : 'auto',
                        overflowY: this.isVerticalScrollbarVisible() ? 'scroll' : 'auto',
                    }}
                    onPointerDown={(e: PointerEvent) => {
                        if (this.isClickedOutOfGrid(e)) e.stopPropagation();
                    }}
                    onScroll={this.scrollHandler}
                >
                    <div style={{ width: cellMatrix.width, height: cellMatrix.height }}></div>
                </div>
                {cellMatrix.frozenTopRange.height > 0 && state.visibleRange && state.visibleRange.width > 0 && (
                    <div
                        className="rg-frozen rg-frozen-top"
                        style={{
                            width: this.isHorizontalScrollbarVisible() ? hiddenScrollableElement.clientWidth : cellMatrix.frozenLeftRange.width + state.visibleRange.width + (cellMatrix.frozenRightRange.width > 0 ? cellMatrix.frozenRightRange.width : 0),
                            height: cellMatrix.frozenTopRange.height,
                        }}
                    >
                        {cellMatrix.frozenLeftRange.width > 0 &&
                            <Pane
                                id="TL"
                                class="rg-pane-tl"
                                state={state}
                                style={{}}
                                range={cellMatrix.frozenLeftRange.slice(cellMatrix.frozenTopRange, 'rows')}
                                borders={{}}
                            />
                        }
                        <div
                            className="rg-pane-wrapper"
                            ref={(frozenTopScrollableElement: HTMLDivElement) => frozenTopScrollableElement && this.frozenTopScrollableElementRefHandler(state, frozenTopScrollableElement)}
                            style={{
                                left: cellMatrix.frozenLeftRange.width,
                                width: `calc(100% - ${cellMatrix.frozenLeftRange.width + cellMatrix.frozenRightRange.width}px + 2px)`, height: 'calc(100% + 2px)',
                            }}>
                            <Pane
                                id="TC"
                                class="rg-pane-tc"
                                state={state}
                                style={{
                                    width: cellMatrix.width - cellMatrix.frozenLeftRange.width - cellMatrix.frozenRightRange.width + 2,
                                }}
                                range={cellMatrix.frozenTopRange.slice(state.visibleRange, 'columns')}
                                borders={{}}
                            />
                        </div>
                        {cellMatrix.frozenRightRange.width > 0 && (
                            <Pane
                                id="TR"
                                class="rg-pane-tr"
                                state={state}
                                style={{}}
                                range={cellMatrix.frozenRightRange.slice(cellMatrix.frozenTopRange, 'rows')}
                                borders={{}}
                            />
                        )}
                    </div>
                )}
                {cellMatrix.scrollableRange.height > 0 && state.visibleRange && state.visibleRange.width > 0 && state.visibleRange.height > 0 && (
                    <div
                        className="rg-middle-wrapper"
                        style={{
                            top: cellMatrix.frozenTopRange.height,
                            width: this.isHorizontalScrollbarVisible() ? hiddenScrollableElement.clientWidth : cellMatrix.frozenLeftRange.width + state.visibleRange.width + (cellMatrix.frozenRightRange.width > 0 ? cellMatrix.frozenRightRange.width : 0),
                            height: this.isVerticalScrollbarVisible() ? hiddenScrollableElement.clientHeight - cellMatrix.frozenTopRange.height - cellMatrix.frozenBottomRange.height : state.visibleRange.height,
                        }}
                    >
                        {cellMatrix.frozenLeftRange.width > 0 && (
                            <div
                                className="rg-middle rg-frozen-left"
                                ref={(frozenLeftScrollableElement: HTMLDivElement) => frozenLeftScrollableElement && this.frozenLeftScrollableElementRefHandler(state, frozenLeftScrollableElement)}
                                style={{
                                    width: cellMatrix.frozenLeftRange.width,
                                }}>
                                <Pane
                                    id="ML"
                                    class="rg-pane-ml"
                                    state={state}
                                    style={{
                                        height: cellMatrix.height,
                                    }}
                                    range={cellMatrix.frozenLeftRange.slice(cellMatrix.scrollableRange.slice(state.visibleRange, 'rows'), 'rows')}
                                    borders={{}}
                                />
                            </div>
                        )}
                        {cellMatrix.frozenRightRange.width > 0 && (
                            <div
                                className="rg-middle rg-frozen-right"
                                ref={(frozenRightScrollableElement: HTMLDivElement) => frozenRightScrollableElement && this.frozenRightScrollableElementRefHandler(state, frozenRightScrollableElement)}
                                style={{
                                    width: cellMatrix.frozenRightRange.width,
                                }}
                            >
                                <Pane
                                    id="MR"
                                    class="rg-pane-mr"
                                    state={state}
                                    style={{
                                        height: cellMatrix.height,
                                    }}
                                    range={cellMatrix.frozenRightRange.slice(cellMatrix.scrollableRange.slice(state.visibleRange, 'rows'), 'rows')}
                                    borders={{}}
                                />
                            </div>
                        )}
                    </div>
                )}
                {cellMatrix.frozenBottomRange.height > 0 && state.visibleRange && state.visibleRange.width > 0 && cellMatrix.rows.length > 1 && (
                    <div
                        className="rg-frozen rg-frozen-bottom"
                        style={{
                            bottom: this.isHorizontalScrollbarVisible() && this.isVerticalScrollbarVisible() ? 17 : (!this.isVerticalScrollbarVisible() ? `calc(100% - ${cellMatrix.frozenTopRange.height + state.visibleRange.height + cellMatrix.frozenBottomRange.height}px)` : 0),
                            width: this.isHorizontalScrollbarVisible() ? hiddenScrollableElement.clientWidth : cellMatrix.frozenLeftRange.width + state.visibleRange.width + (cellMatrix.frozenRightRange.width > 0 ? cellMatrix.frozenRightRange.width : 0),
                            height: cellMatrix.frozenBottomRange.height,
                        }}>
                        {cellMatrix.frozenLeftRange.width > 0 &&
                            <Pane
                                id="BL"
                                class="rg-pane-bl"
                                state={state}
                                style={{}}
                                range={cellMatrix.frozenLeftRange.slice(cellMatrix.frozenBottomRange, 'rows')}
                                borders={{}}
                            />
                        }
                        {state.visibleRange && state.visibleRange.width > 0 &&
                            <div
                                className="rg-pane-bl-wrapper"
                                ref={(frozenBottomScrollableElement: HTMLDivElement) => frozenBottomScrollableElement && this.frozenBottomScrollableElementRefHandler(state, frozenBottomScrollableElement)}
                                style={{
                                    left: cellMatrix.frozenLeftRange.width,
                                    width: `calc(100% - ${cellMatrix.frozenLeftRange.width + cellMatrix.frozenRightRange.width}px)`, height: cellMatrix.frozenBottomRange.height,
                                }}>
                                <Pane
                                    id="BC"
                                    class="rg-pane-bc"
                                    state={state}
                                    style={{
                                        width: cellMatrix.scrollableRange.width + 2,
                                    }}
                                    range={cellMatrix.frozenBottomRange.slice(state.visibleRange, 'columns')}
                                    borders={{}}
                                />
                            </div>
                        }
                        {cellMatrix.frozenRightRange.width > 0 &&
                            <Pane
                                id="BR"
                                class="rg-pane-br"
                                state={state}
                                style={{ right: 0, overflow: 'hidden' }}
                                range={cellMatrix.frozenRightRange.slice(cellMatrix.frozenBottomRange, 'rows')}
                                borders={{}}
                            />
                        }
                    </div>
                )}
                <div
                    className="rg-viewport"
                    ref={eventHandlers.viewportElementRefHandler}
                    style={{
                        right: (this.isHorizontalScrollbarVisible() && this.isVerticalScrollbarVisible() ? 17 : 0),
                        bottom: (this.isHorizontalScrollbarVisible() && this.isVerticalScrollbarVisible() ? 17 : 0),
                    }}
                >
                    <div
                        data-cy="react-grid"
                        className="rg-content"
                        style={{ width: cellMatrix.width, height: cellMatrix.height }}
                    >
                        {cellMatrix.scrollableRange.height > 0 && cellMatrix.scrollableRange.first.column && cellMatrix.scrollableRange.first.row && cellMatrix.scrollableRange.last.row && state.visibleRange && state.visibleRange.height > 0 &&
                            <Pane
                                id="MC"
                                class="rg-pane-mc"
                                state={state}
                                style={{
                                    top: cellMatrix.frozenTopRange.height,
                                    left: cellMatrix.frozenLeftRange.width + (17 / 2),
                                    width: this.isHorizontalScrollbarVisible() ? cellMatrix.width : state.visibleRange.width,
                                    height: this.isVerticalScrollbarVisible() ? cellMatrix.height : state.visibleRange.height
                                }}
                                range={cellMatrix.scrollableRange.slice(state.visibleRange, 'rows').slice(state.visibleRange, 'columns')}
                                borders={{ right: false, bottom: false }}
                            />
                        }
                        <input
                            className="rg-input-xy"
                            ref={(input: HTMLInputElement) => {
                                if (input) {
                                    eventHandlers.hiddenElementRefHandler(input);
                                    input.setSelectionRange(0, 1);
                                }
                            }}
                            value="&nbsp;"
                            onChange={() => { }}
                        />
                        <Line linePosition={state.linePosition} orientation={state.lineOrientation} cellMatrix={state.cellMatrix} />
                        <Shadow shadowPosition={state.shadowPosition} orientation={state.lineOrientation} cellMatrix={state.cellMatrix} shadowSize={state.shadowSize} cursor={state.shadowCursor} />
                        {state.contextMenuPosition.top !== -1 && state.contextMenuPosition.left !== -1 &&
                            <ContextMenu
                                state={state}
                                onContextMenu={(menuOptions: MenuOption[]) => state.props.onContextMenu
                                    ? state.props.onContextMenu((state.selectionMode === 'row') ? state.selectedIndexes : [],
                                        (state.selectionMode === 'column') ? state.selectedIndexes : [], state.selectionMode, menuOptions)
                                    : []}
                                contextMenuPosition={state.contextMenuPosition}
                            />
                        }
                    </div>
                </div>
                {state.currentlyEditedCell && <CellEditor state={state} />}
            </div>
        );
    }

    private hiddenScrollableElementRefHandler(state: State, hiddenScrollableElement: HTMLDivElement) {
        state.hiddenScrollableElement = hiddenScrollableElement;
    }

    private frozenTopScrollableElementRefHandler(state: State, frozenTopScrollableElement: HTMLDivElement) {
        this.frozenTopScrollableElement = frozenTopScrollableElement;
        this.frozenTopScrollableElement.scrollLeft = state.hiddenScrollableElement.scrollLeft;
    }

    private frozenRightScrollableElementRefHandler(state: State, frozenRightScrollableElement: HTMLDivElement) {
        this.frozenRightScrollableElement = frozenRightScrollableElement;
        this.frozenRightScrollableElement.scrollTop = state.hiddenScrollableElement.scrollTop;
    }
    private frozenBottomScrollableElementRefHandler(state: State, frozenBottomScrollableElement: HTMLDivElement) {
        this.frozenBottomScrollableElement = frozenBottomScrollableElement;
        this.frozenBottomScrollableElement.scrollLeft = state.hiddenScrollableElement.scrollLeft;
    }
    private frozenLeftScrollableElementRefHandler(state: State, frozenLeftScrollableElement: HTMLDivElement) {
        this.frozenLeftScrollableElement = frozenLeftScrollableElement;
        this.frozenLeftScrollableElement.scrollTop = state.hiddenScrollableElement.scrollTop;
    }

    private scrollHandler = () => {
        const state: State = this.props.state;
        const { scrollTop, scrollLeft } = state.hiddenScrollableElement;

        if (this.frozenTopScrollableElement) {
            this.frozenTopScrollableElement.scrollLeft = scrollLeft;
        }
        if (this.frozenBottomScrollableElement) {
            this.frozenBottomScrollableElement.scrollLeft = scrollLeft;
        }
        if (this.frozenLeftScrollableElement) {
            this.frozenLeftScrollableElement.scrollTop = scrollTop;
        }
        if (this.frozenRightScrollableElement) {
            this.frozenRightScrollableElement.scrollTop = scrollTop;
        }

        if (state.viewportElement) {
            state.viewportElement.scrollTop = scrollTop;
            state.viewportElement.scrollLeft = scrollLeft;
        }

        this.props.eventHandlers.scrollHandler();

    };

    private isClickedOutOfGrid(event: PointerEvent): boolean {
        const hiddenScrollableElement = this.props.state.hiddenScrollableElement;
        const cellMatrix = this.props.state.cellMatrix;

        const rightEmptySpace = hiddenScrollableElement.clientWidth - cellMatrix.width;
        const bottomEmptySpace = hiddenScrollableElement.clientHeight - cellMatrix.height;

        if (cellMatrix.width > hiddenScrollableElement.clientWidth) {
            if (event.clientX > hiddenScrollableElement.clientWidth + hiddenScrollableElement.getBoundingClientRect().left) return true;
        } else {
            if (event.clientX > hiddenScrollableElement.clientWidth - rightEmptySpace + hiddenScrollableElement.getBoundingClientRect().left) return true;
        }

        if (cellMatrix.height > hiddenScrollableElement.clientHeight) {
            if (event.clientY > hiddenScrollableElement.clientHeight + hiddenScrollableElement.getBoundingClientRect().top) return true;
        } else {
            if (event.clientY > hiddenScrollableElement.clientHeight - bottomEmptySpace + hiddenScrollableElement.getBoundingClientRect().top) return true;
        }
        return false;
    }

    private isHorizontalScrollbarVisible(): boolean {
        return this.props.state.hiddenScrollableElement && this.props.state.cellMatrix.width > this.props.state.hiddenScrollableElement.clientWidth;
    }

    private isVerticalScrollbarVisible(): boolean {
        return this.props.state.hiddenScrollableElement && this.props.state.cellMatrix.height > this.props.state.hiddenScrollableElement.clientHeight;
    }
}

export function copySelectedRangeToClipboardInIE(state: State, removeValues = false) {
    // const div = document.createElement('div');
    // const activeSelectedRange = getActiveSelectedRange(state);
    // if (!activeSelectedRange) return;

    // let text = '';
    // activeSelectedRange.rows.forEach((row, rowIdx) => {
    //     activeSelectedRange.cols.forEach((col, colIdx) => {
    //         const prevCol = colIdx - 1 >= 0 ? activeSelectedRange.cols[colIdx - 1] : undefined;
    //         const nextCol = colIdx + 1 < activeSelectedRange.cols.length ? activeSelectedRange.cols[colIdx + 1] : undefined;
    //         const cell = state.cellMatrix.getCell(row.rowId, col.columnId);
    //         const prevCell = prevCol ? state.cellMatrix.getCell(row.rowId, prevCol.columnId) : undefined;
    //         const nextCell = nextCol ? state.cellMatrix.getCell(row.rowId, nextCol.columnId) : undefined;
    //         const cellData = cell.data ? cell.data.toString() : '';
    //         const prevCellData = prevCell && prevCell.data ? prevCell.data.toString() : '';
    //         const nextCellData = nextCell && nextCell.data ? nextCell.data.toString() : '';
    //         text = text + cellData;
    //         if (!cellData) {
    //             text = text + '\t';
    //             if (prevCellData.length > 0 && nextCellData.length > 0) {
    //                 text = text + '\t';
    //             }
    //         } else {
    //             if (nextCellData.length > 0) {
    //                 text = text + '\t';
    //             }
    //         }
    //         if (removeValues) {
    //             state = tryAppendChange(state, newLocation(row, col), emptyCell);
    //         }
    //     });
    //     const areAllEmptyCells = activeSelectedRange.cols.every(el => {
    //         const cellData = state.cellMatrix.getCell(row.rowId, el.columnId).data;
    //         if (!cellData) {
    //             return true;
    //         } else {
    //             return false;
    //         }
    //     });
    //     if (areAllEmptyCells) {
    //         text = text.substring(0, text.length - 1);
    //     }
    //     text = activeSelectedRange.rows.length > 1 && rowIdx < activeSelectedRange.rows.length - 1 ? text + '\n' : text;
    // });
    // div.setAttribute('contenteditable', 'true');
    // document.body.appendChild(div);
    // div.focus();
    // (window as any).clipboardData.setData('text', text);
    // document.body.removeChild(div);
}
