var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import * as React from 'react';
import { Line } from './Line';
import { Shadow } from './Shadow';
import { ContextMenu } from './ContextMenu';
import { CellEditor } from './CellEditor';
import { Pane } from './Pane';
import { recalcVisibleRange } from '../Functions';
var LegacyBrowserGridRenderer = (function (_super) {
    __extends(LegacyBrowserGridRenderer, _super);
    function LegacyBrowserGridRenderer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.scrollHandler = function () {
            var state = _this.props.state;
            var _a = state.hiddenScrollableElement, scrollTop = _a.scrollTop, scrollLeft = _a.scrollLeft;
            if (_this.frozenTopScrollableElement) {
                _this.frozenTopScrollableElement.scrollLeft = scrollLeft;
            }
            if (_this.frozenBottomScrollableElement) {
                _this.frozenBottomScrollableElement.scrollLeft = scrollLeft;
            }
            if (_this.frozenLeftScrollableElement) {
                _this.frozenLeftScrollableElement.scrollTop = scrollTop;
            }
            if (_this.frozenRightScrollableElement) {
                _this.frozenRightScrollableElement.scrollTop = scrollTop;
            }
            if (state.viewportElement) {
                state.viewportElement.scrollTop = scrollTop;
                state.viewportElement.scrollLeft = scrollLeft;
            }
            if (scrollTop < state.minScrollTop || scrollTop > state.maxScrollTop || scrollLeft < state.minScrollLeft || scrollLeft > state.maxScrollLeft) {
                state.update(function (state) { return recalcVisibleRange(state); });
            }
        };
        return _this;
    }
    LegacyBrowserGridRenderer.prototype.render = function () {
        var _this = this;
        var _a = this.props, eventHandlers = _a.eventHandlers, state = _a.state;
        var cellMatrix = state.cellMatrix;
        var hiddenScrollableElement = state.hiddenScrollableElement;
        return (React.createElement("div", { className: "reactgrid-legacy-browser", onKeyDown: eventHandlers.keyDownHandler, onKeyUp: eventHandlers.keyUpHandler, onPointerDown: eventHandlers.pointerDownHandler },
            React.createElement("div", { ref: function (hiddenScrollableElement) { return hiddenScrollableElement && _this.hiddenScrollableElementRefHandler(state, hiddenScrollableElement); }, className: "rg-hidden-scrollable-element", style: {
                    overflowX: this.isHorizontalScrollbarVisible() ? 'scroll' : 'auto',
                    overflowY: this.isVerticalScrollbarVisible() ? 'scroll' : 'auto',
                }, onPointerDown: function (e) {
                    if (_this.isClickedOutOfGrid(e))
                        e.stopPropagation();
                }, onScroll: this.scrollHandler },
                React.createElement("div", { style: { width: cellMatrix.width, height: cellMatrix.height } })),
            cellMatrix.frozenTopRange.height > 0 && state.visibleRange && state.visibleRange.width > 0 && (React.createElement("div", { className: "rg-frozen rg-frozen-top", style: {
                    width: this.isHorizontalScrollbarVisible() ? hiddenScrollableElement.clientWidth : cellMatrix.frozenLeftRange.width + state.visibleRange.width + (cellMatrix.frozenRightRange.width > 0 ? cellMatrix.frozenRightRange.width : 0),
                    height: cellMatrix.frozenTopRange.height,
                } },
                cellMatrix.frozenLeftRange.width > 0 &&
                    React.createElement(Pane, { id: "TL", class: "rg-pane-tl", state: state, style: {}, range: cellMatrix.frozenLeftRange.slice(cellMatrix.frozenTopRange, 'rows'), borders: {} }),
                React.createElement("div", { className: "rg-pane-wrapper", ref: function (frozenTopScrollableElement) { return frozenTopScrollableElement && _this.frozenTopScrollableElementRefHandler(state, frozenTopScrollableElement); }, style: {
                        left: cellMatrix.frozenLeftRange.width,
                        width: "calc(100% - " + (cellMatrix.frozenLeftRange.width + cellMatrix.frozenRightRange.width) + "px + 2px)", height: 'calc(100% + 2px)',
                    } },
                    React.createElement(Pane, { id: "TC", class: "rg-pane-tc", state: state, style: {
                            width: cellMatrix.width - cellMatrix.frozenLeftRange.width - cellMatrix.frozenRightRange.width + 2,
                        }, range: cellMatrix.frozenTopRange.slice(state.visibleRange, 'columns'), borders: {} })),
                cellMatrix.frozenRightRange.width > 0 && (React.createElement(Pane, { id: "TR", class: "rg-pane-tr", state: state, style: {}, range: cellMatrix.frozenRightRange.slice(cellMatrix.frozenTopRange, 'rows'), borders: {} })))),
            cellMatrix.scrollableRange.height > 0 && state.visibleRange && state.visibleRange.width > 0 && (React.createElement("div", { className: "rg-middle-wrapper", style: {
                    top: cellMatrix.frozenTopRange.height,
                    width: this.isHorizontalScrollbarVisible() ? hiddenScrollableElement.clientWidth : cellMatrix.frozenLeftRange.width + state.visibleRange.width + (cellMatrix.frozenRightRange.width > 0 ? cellMatrix.frozenRightRange.width : 0),
                    height: this.isVerticalScrollbarVisible() ? hiddenScrollableElement.clientHeight - cellMatrix.frozenTopRange.height - cellMatrix.frozenBottomRange.height : state.visibleRange.height,
                } },
                cellMatrix.frozenLeftRange.width > 0 && (React.createElement("div", { className: "rg-middle rg-frozen-left", ref: function (frozenLeftScrollableElement) { return frozenLeftScrollableElement && _this.frozenLeftScrollableElementRefHandler(state, frozenLeftScrollableElement); }, style: {
                        width: cellMatrix.frozenLeftRange.width,
                    } },
                    React.createElement(Pane, { id: "ML", class: "rg-pane-ml", state: state, style: {
                            height: cellMatrix.height,
                        }, range: cellMatrix.frozenLeftRange.slice(cellMatrix.scrollableRange.slice(state.visibleRange, 'rows'), 'rows'), borders: {} }))),
                cellMatrix.frozenRightRange.width > 0 && (React.createElement("div", { className: "rg-middle rg-frozen-right", ref: function (frozenRightScrollableElement) { return frozenRightScrollableElement && _this.frozenRightScrollableElementRefHandler(state, frozenRightScrollableElement); }, style: {
                        width: cellMatrix.frozenRightRange.width,
                    } },
                    React.createElement(Pane, { id: "MR", class: "rg-pane-mr", state: state, style: {
                            height: cellMatrix.height,
                        }, range: cellMatrix.frozenRightRange.slice(cellMatrix.scrollableRange.slice(state.visibleRange, 'rows'), 'rows'), borders: {} }))))),
            cellMatrix.frozenBottomRange.height > 0 && state.visibleRange && state.visibleRange.width > 0 && cellMatrix.rows.length > 1 && (React.createElement("div", { className: "rg-frozen rg-frozen-bottom", style: {
                    bottom: this.isHorizontalScrollbarVisible() && this.isVerticalScrollbarVisible() ? 17 : (!this.isVerticalScrollbarVisible() ? "calc(100% - " + (cellMatrix.frozenTopRange.height + state.visibleRange.height + cellMatrix.frozenBottomRange.height) + "px)" : 0),
                    width: this.isHorizontalScrollbarVisible() ? hiddenScrollableElement.clientWidth : cellMatrix.frozenLeftRange.width + state.visibleRange.width + (cellMatrix.frozenRightRange.width > 0 ? cellMatrix.frozenRightRange.width : 0),
                    height: cellMatrix.frozenBottomRange.height,
                } },
                cellMatrix.frozenLeftRange.width > 0 &&
                    React.createElement(Pane, { id: "BL", class: "rg-pane-bl", state: state, style: {}, range: cellMatrix.frozenLeftRange.slice(cellMatrix.frozenBottomRange, 'rows'), borders: {} }),
                state.visibleRange && state.visibleRange.width > 0 &&
                    React.createElement("div", { className: "rg-pane-bl-wrapper", ref: function (frozenBottomScrollableElement) { return frozenBottomScrollableElement && _this.frozenBottomScrollableElementRefHandler(state, frozenBottomScrollableElement); }, style: {
                            left: cellMatrix.frozenLeftRange.width,
                            width: "calc(100% - " + (cellMatrix.frozenLeftRange.width + cellMatrix.frozenRightRange.width) + "px)", height: cellMatrix.frozenBottomRange.height,
                        } },
                        React.createElement(Pane, { id: "BC", class: "rg-pane-bc", state: state, style: {
                                width: cellMatrix.scrollableRange.width + 2,
                            }, range: cellMatrix.frozenBottomRange.slice(state.visibleRange, 'columns'), borders: {} })),
                cellMatrix.frozenRightRange.width > 0 &&
                    React.createElement(Pane, { id: "BR", class: "rg-pane-br", state: state, style: {}, range: cellMatrix.frozenRightRange.slice(cellMatrix.frozenBottomRange, 'rows'), borders: {} }))),
            React.createElement("div", { className: "rg-viewport", ref: eventHandlers.viewportElementRefHandler, style: {
                    right: (this.isHorizontalScrollbarVisible() && this.isVerticalScrollbarVisible() ? 17 : 0),
                    bottom: (this.isHorizontalScrollbarVisible() && this.isVerticalScrollbarVisible() ? 17 : 0),
                } },
                React.createElement("div", { "data-cy": "reac-grid", className: "rg-content", style: { width: cellMatrix.width, height: cellMatrix.height } },
                    cellMatrix.scrollableRange.height > 0 && cellMatrix.scrollableRange.first.column && cellMatrix.scrollableRange.first.row && cellMatrix.scrollableRange.last.row && state.visibleRange &&
                        React.createElement(Pane, { id: "MC", class: "rg-pane-mc", state: state, style: {
                                top: cellMatrix.frozenTopRange.height, left: cellMatrix.frozenLeftRange.width,
                                width: this.isHorizontalScrollbarVisible() ? cellMatrix.width : state.visibleRange.width,
                                height: this.isVerticalScrollbarVisible() ? cellMatrix.height : state.visibleRange.height
                            }, range: cellMatrix.scrollableRange.slice(state.visibleRange, 'rows').slice(state.visibleRange, 'columns'), borders: { right: false, bottom: false } }),
                    React.createElement("input", { className: "rg-input-xy", ref: function (input) {
                            if (input) {
                                eventHandlers.hiddenElementRefHandler(input);
                                input.setSelectionRange(0, 1);
                            }
                        }, value: "\u00A0", onChange: function () { } }),
                    React.createElement(Line, { linePosition: state.linePosition, orientation: state.lineOrientation, cellMatrix: state.cellMatrix }),
                    React.createElement(Shadow, { shadowPosition: state.shadowPosition, orientation: state.lineOrientation, cellMatrix: state.cellMatrix, shadowSize: state.shadowSize, cursor: state.shadowCursor }),
                    state.contextMenuPosition.top !== -1 && state.contextMenuPosition.left !== -1 &&
                        React.createElement(ContextMenu, { state: state, onContextMenu: function (menuOptions) { return state.props.onContextMenu
                                ? state.props.onContextMenu((state.selectionMode === 'row') ? state.selectedIndexes : [], (state.selectionMode === 'column') ? state.selectedIndexes : [], state.selectionMode, menuOptions)
                                : []; }, contextMenuPosition: state.contextMenuPosition }))),
            state.currentlyEditedCell && React.createElement(CellEditor, { state: state })));
    };
    LegacyBrowserGridRenderer.prototype.hiddenScrollableElementRefHandler = function (state, hiddenScrollableElement) {
        state.hiddenScrollableElement = hiddenScrollableElement;
    };
    LegacyBrowserGridRenderer.prototype.frozenTopScrollableElementRefHandler = function (state, frozenTopScrollableElement) {
        this.frozenTopScrollableElement = frozenTopScrollableElement;
        this.frozenTopScrollableElement.scrollLeft = state.hiddenScrollableElement.scrollLeft;
    };
    LegacyBrowserGridRenderer.prototype.frozenRightScrollableElementRefHandler = function (state, frozenRightScrollableElement) {
        this.frozenRightScrollableElement = frozenRightScrollableElement;
        this.frozenRightScrollableElement.scrollTop = state.hiddenScrollableElement.scrollTop;
    };
    LegacyBrowserGridRenderer.prototype.frozenBottomScrollableElementRefHandler = function (state, frozenBottomScrollableElement) {
        this.frozenBottomScrollableElement = frozenBottomScrollableElement;
        this.frozenBottomScrollableElement.scrollLeft = state.hiddenScrollableElement.scrollLeft;
    };
    LegacyBrowserGridRenderer.prototype.frozenLeftScrollableElementRefHandler = function (state, frozenLeftScrollableElement) {
        this.frozenLeftScrollableElement = frozenLeftScrollableElement;
        this.frozenLeftScrollableElement.scrollTop = state.hiddenScrollableElement.scrollTop;
    };
    LegacyBrowserGridRenderer.prototype.isClickedOutOfGrid = function (event) {
        var hiddenScrollableElement = this.props.state.hiddenScrollableElement;
        var cellMatrix = this.props.state.cellMatrix;
        var rightEmptySpace = hiddenScrollableElement.clientWidth - cellMatrix.width;
        var bottomEmptySpace = hiddenScrollableElement.clientHeight - cellMatrix.height;
        if (cellMatrix.width > hiddenScrollableElement.clientWidth) {
            if (event.clientX > hiddenScrollableElement.clientWidth + hiddenScrollableElement.getBoundingClientRect().left)
                return true;
        }
        else {
            if (event.clientX > hiddenScrollableElement.clientWidth - rightEmptySpace + hiddenScrollableElement.getBoundingClientRect().left)
                return true;
        }
        if (cellMatrix.height > hiddenScrollableElement.clientHeight) {
            if (event.clientY > hiddenScrollableElement.clientHeight + hiddenScrollableElement.getBoundingClientRect().top)
                return true;
        }
        else {
            if (event.clientY > hiddenScrollableElement.clientHeight - bottomEmptySpace + hiddenScrollableElement.getBoundingClientRect().top)
                return true;
        }
        return false;
    };
    LegacyBrowserGridRenderer.prototype.isHorizontalScrollbarVisible = function () {
        return this.props.state.hiddenScrollableElement && this.props.state.cellMatrix.width > this.props.state.hiddenScrollableElement.clientWidth;
    };
    LegacyBrowserGridRenderer.prototype.isVerticalScrollbarVisible = function () {
        return this.props.state.hiddenScrollableElement && this.props.state.cellMatrix.height > this.props.state.hiddenScrollableElement.clientHeight;
    };
    return LegacyBrowserGridRenderer;
}(React.Component));
export { LegacyBrowserGridRenderer };
export function copySelectedRangeToClipboardInIE(state, removeValues) {
    if (removeValues === void 0) { removeValues = false; }
}
