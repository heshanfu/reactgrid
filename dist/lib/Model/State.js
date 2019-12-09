import { DefaultBehavior } from '../Behaviors/DefaultBehavior';
import { isBrowserIE, isBrowserEdge } from '../Functions';
var State = (function () {
    function State(update) {
        this.update = update;
        this.legacyBrowserMode = isBrowserIE() || isBrowserEdge();
        this.currentBehavior = new DefaultBehavior();
        this.queuedCellChanges = [];
        this.highlightLocations = [];
        this.disableFillHandle = false;
        this.disableRangeSelection = false;
        this.enableColumnSelection = false;
        this.enableRowSelection = false;
        this.contextMenuPosition = { top: -1, left: -1 };
        this.lineOrientation = 'horizontal';
        this.linePosition = -1;
        this.shadowSize = 0;
        this.shadowPosition = -1;
        this.shadowCursor = 'default';
        this.selectionMode = 'range';
        this.selectedRanges = [];
        this.selectedIndexes = [];
        this.selectedIds = [];
        this.activeSelectedRangeIdx = 0;
        this.minScrollTop = -1;
        this.maxScrollTop = -1;
        this.minScrollLeft = -1;
        this.maxScrollLeft = -1;
        this.log = function (text) { };
    }
    return State;
}());
export { State };