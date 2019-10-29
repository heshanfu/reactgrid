import { isBrowserIE, isBrowserEdge } from "../Functions";
export function scrollIntoView(state, location, direction) {
    if (direction === void 0) { direction = 'both'; }
    var top = getScrollTop(state, location, direction === 'horizontal');
    var left = getScrollLeft(state, location, direction === 'vertical');
    if (isBrowserIE() || isBrowserEdge()) {
        state.hiddenScrollableElement.scrollTop = top;
        state.hiddenScrollableElement.scrollLeft = left;
    }
    else {
        state.viewportElement.scrollTop = top;
        state.viewportElement.scrollLeft = left;
    }
}
function getScrollTop(state, location, dontChange) {
    var row = location.row;
    var _a = state.viewportElement, scrollTop = _a.scrollTop, clientHeight = _a.clientHeight;
    var _b = state.cellMatrix, frozenTopRange = _b.frozenTopRange, frozenBottomRange = _b.frozenBottomRange, rows = _b.rows;
    if (dontChange || !row)
        return scrollTop;
    var visibleContentHeight = Math.min(clientHeight, state.cellMatrix.height);
    var visibleScrollAreaHeight = visibleContentHeight - frozenTopRange.height - frozenBottomRange.height;
    var isBottomRowFrozen = frozenBottomRange.rows.some(function (r) { return row.idx === r.idx; });
    var shouldScrollToBottom = function () { return ((location.cellY ? row.top + location.cellY : row.bottom) > visibleScrollAreaHeight + scrollTop - 4) || state.cellMatrix.last.row.idx === row.idx; };
    var shouldScrollToTop = function () { return row.top + (location.cellY ? location.cellY : 0) < scrollTop + 1 && !isBottomRowFrozen; };
    var isColumnBelowBottomPane = function () { return row.bottom > visibleScrollAreaHeight + scrollTop; };
    var isColumnBelowTopPane = function () { return row.top < scrollTop && !isBottomRowFrozen; };
    if (frozenBottomRange.rows.length === 0 && shouldScrollToBottom()) {
        if (location.cellY) {
            return rows[row.idx + 1] ? rows[row.idx + 1].bottom - visibleScrollAreaHeight + 1 : rows[row.idx].bottom - visibleScrollAreaHeight + 1;
        }
        else {
            return row.bottom - visibleScrollAreaHeight + 1;
        }
    }
    else if (isColumnBelowBottomPane() && (state.focusedLocation && frozenBottomRange.rows.length > 0) && state.focusedLocation.row.idx < frozenBottomRange.rows[0].idx) {
        return row.bottom - visibleScrollAreaHeight;
    }
    else if (frozenTopRange.rows.length === 0 && shouldScrollToTop()) {
        if (location.cellY) {
            return rows[row.idx - 1] ? rows[row.idx + -1].top - 1 : rows[row.idx].top - 1;
        }
        else {
            return row.top - 1;
        }
    }
    else if (isColumnBelowTopPane() && state.focusedLocation && state.focusedLocation.row.idx > frozenTopRange.rows.length) {
        return row.top - 1;
    }
    else {
        return scrollTop;
    }
}
function getScrollLeft(state, location, dontChange) {
    var column = location.col;
    var _a = state.viewportElement, scrollLeft = _a.scrollLeft, clientWidth = _a.clientWidth;
    var _b = state.cellMatrix, frozenLeftRange = _b.frozenLeftRange, frozenRightRange = _b.frozenRightRange, cols = _b.cols;
    if (dontChange || !column)
        return scrollLeft;
    var visibleContentWidth = Math.min(clientWidth, state.cellMatrix.width);
    var visibleScrollAreaWidth = visibleContentWidth - frozenLeftRange.width - frozenRightRange.width;
    var isRightColFrozen = frozenRightRange.cols.some(function (col) { return column.idx === col.idx; });
    var shouldScrollToRight = function () { return ((location.cellX ? column.left + location.cellX : column.right) > visibleScrollAreaWidth + scrollLeft - 1) || state.cellMatrix.last.col.idx === location.col.idx; };
    var shouldScrollToLeft = function () { return column.left + (location.cellX ? location.cellX : 0) < scrollLeft + 1 && !isRightColFrozen; };
    var isColumnBelowRightPane = function () { return column.right > visibleScrollAreaWidth + scrollLeft; };
    var isColumnBelowLeftPane = function () { return column.left < scrollLeft && !isRightColFrozen; };
    if (frozenRightRange.cols.length === 0 && shouldScrollToRight()) {
        if (location.cellX) {
            return cols[column.idx + 1] ? cols[column.idx + 1].right - visibleScrollAreaWidth + 1 : cols[column.idx].right - visibleScrollAreaWidth + 1;
        }
        else {
            return column.right - visibleScrollAreaWidth + 1;
        }
    }
    else if (isColumnBelowRightPane() && (state.focusedLocation && frozenRightRange.cols.length > 0) && state.focusedLocation.col.idx < frozenRightRange.cols[0].idx) {
        return column.right - visibleScrollAreaWidth + 1;
    }
    else if (frozenLeftRange.cols.length === 0 && shouldScrollToLeft()) {
        if (location.cellX) {
            return cols[column.idx - 1] ? cols[column.idx + -1].left - 1 : cols[column.idx].left - 1;
        }
        else {
            return column.left - 1;
        }
    }
    else if (isColumnBelowLeftPane() && state.focusedLocation && state.focusedLocation.col.idx > frozenLeftRange.cols.length) {
        return column.left - 1;
    }
    else {
        return scrollLeft;
    }
}
