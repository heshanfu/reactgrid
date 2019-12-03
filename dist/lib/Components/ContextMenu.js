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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import * as React from 'react';
import { copySelectedRangeToClipboard, pasteData } from '../Behaviors/DefaultBehavior';
import { isBrowserIE, getDataToPasteInIE } from '../Functions';
var ContextMenu = (function (_super) {
    __extends(ContextMenu, _super);
    function ContextMenu() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ContextMenu.prototype.render = function () {
        var _a = this.props, contextMenuPosition = _a.contextMenuPosition, onContextMenu = _a.onContextMenu, state = _a.state;
        var focusedLocation = state.focusedLocation;
        var contextMenuOptions = customContextMenuOptions(state);
        var options = onContextMenu ? onContextMenu(customContextMenuOptions(state)) : [];
        if (focusedLocation && options.length > 0) {
            contextMenuOptions = options;
        }
        return (contextMenuOptions.length > 0 &&
            (React.createElement("div", { className: "rg-context-menu", style: {
                    top: contextMenuPosition.top + 'px',
                    left: contextMenuPosition.left + 'px',
                } }, contextMenuOptions.map(function (el, idx) { return (React.createElement("div", { key: idx, className: "rg-context-menu-option", onPointerDown: function (e) { return e.stopPropagation(); }, onClick: function () {
                    el.handler();
                    state.update(function (state) { return (__assign({}, state, { contextMenuPosition: { top: -1, left: -1 } })); });
                } }, el.label)); }))));
    };
    return ContextMenu;
}(React.Component));
export { ContextMenu };
function customContextMenuOptions(state) {
    return [
        {
            id: 'copy',
            label: 'Copy',
            handler: function () { return copySelectedRangeToClipboard(state, false); }
        },
        {
            id: 'cut',
            label: 'Cut',
            handler: function () { return copySelectedRangeToClipboard(state, true); }
        },
        {
            id: 'paste',
            label: 'Paste',
            handler: function () {
                if (isBrowserIE()) {
                    setTimeout(function () { return state.update(function (state) { return pasteData(state, getDataToPasteInIE()); }); });
                }
                else {
                    navigator.clipboard.readText().then(function (e) { return state.update(function (state) { return pasteData(state, e.split('\n').map(function (line) { return line.split('\t').map(function (t) { return ({ type: 'text', text: t, value: parseFloat(t) }); }); })); }); });
                }
            }
        }
    ];
}
