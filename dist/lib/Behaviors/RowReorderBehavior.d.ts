import { State, Behavior, PointerEvent, PointerLocation, Direction } from '../Common';
export declare class RowReorderBehavior extends Behavior {
    private initialRowIdx;
    private lastPossibleDropLocation?;
    private pointerOffset;
    private selectedIds;
    private position;
    autoScrollDirection: Direction;
    handlePointerDown(event: PointerEvent, location: PointerLocation, state: State): State;
    handlePointerMove(event: PointerEvent, location: PointerLocation, state: State): State;
    getShadowPosition(location: PointerLocation, state: State): number;
    getLastPossibleDropLocation(currentLocation: PointerLocation): PointerLocation | undefined;
    handlePointerUp(event: PointerEvent, location: PointerLocation, state: State): State;
}
