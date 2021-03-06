import { CellMatrix, Behavior, Range, Location, SelectionMode, Orientation, CellChange } from '.';
import { DefaultBehavior } from '../Behaviors/DefaultBehavior';
import { CellTemplates, Id, Cell, ReactGridProps, Compatible, Highlight } from './PublicModel';
import { isBrowserIE, isBrowserEdge } from '../Functions';

export type StateModifier = (state: State) => State;
export type StateUpdater = (modifier: StateModifier) => void;

// ASK ARCHITECT BEFORE INTRODUCING ANY CHANGE!
// INTERNAL
export class State {
    constructor(public update: StateUpdater) { }
    readonly props!: ReactGridProps;
    readonly legacyBrowserMode = isBrowserIE() || isBrowserEdge();
    readonly cellMatrix!: CellMatrix;
    readonly currentBehavior: Behavior = new DefaultBehavior();

    readonly cellTemplates!: CellTemplates;
    hiddenFocusElement!: HTMLDivElement; // updated without setState
    readonly viewportElement!: HTMLDivElement;

    // element for LegacyBrowserGridRenderer
    // TODO try to eliminate
    hiddenScrollableElement!: HTMLDivElement;

    readonly queuedCellChanges: CellChange[] = [];
    currentlyEditedCell?: Compatible<Cell>;
    // TODO updated customFocuses, CellLocation can be here?
    readonly highlightLocations: Highlight[] = [];
    readonly disableFillHandle: boolean = false;
    readonly disableRangeSelection: boolean = false;
    readonly enableColumnSelection: boolean = false;
    readonly enableRowSelection: boolean = false;
    readonly disableFloatingCellEditor: boolean = false;

    // CONTEXT MENU
    readonly contextMenuPosition: { top: number, left: number } = { top: -1, left: -1 }; // [top, left]

    // LINE AND SHADOW
    readonly lineOrientation: Orientation = 'horizontal';
    readonly linePosition: number = -1;
    readonly shadowSize: number = 0;
    readonly shadowPosition: number = -1;
    readonly shadowCursor: string = 'default';

    // SELECTION
    readonly selectionMode: SelectionMode = 'range';
    readonly selectedRanges: Range[] = [];
    readonly selectedIndexes: number[] = [];
    readonly selectedIds: Id[] = [];
    readonly focusedLocation?: Location;
    readonly activeSelectedRangeIdx: number = 0;

    // VISIBLE RANGE
    readonly visibleRange!: Range;
    readonly minScrollTop: number = -1;
    readonly maxScrollTop: number = -1;
    readonly minScrollLeft: number = -1;
    readonly maxScrollLeft: number = -1;

    // LOGGING
    readonly log = (text: string) => { };
}
