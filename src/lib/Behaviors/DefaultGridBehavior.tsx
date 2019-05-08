import * as React from "react";
import { GridContext, Behavior, KeyboardEvent, ClipboardEvent, PointerEvent, Location, Range } from "../Common";
// import { pointerDownHandler } from "./DefaultGridBehavior/pointerDownHandler";
import { keyDownHandlers } from "./DefaultGridBehavior/keyDownHandlers";
import { keyUpHandlers } from "./DefaultGridBehavior/keyUpHandler";
import { getLocationFromClient, focusLocation, changeBehavior } from "../Functions";
import { selectRange } from "../Functions/selectRange";
import { CellSelectionBehavior } from "./CellSelectionBehavior";

export let setFocusLocation: (location: Location) => void = _ => { };

export class DefaultGridBehavior implements Behavior {

    constructor(private gridContext: GridContext) { }

    handlePointerDown(event: PointerEvent): void {
        const location = getLocationFromClient(this.gridContext, event.clientX, event.clientY);
        if (event.shiftKey && this.gridContext.state.focusedLocation) {
            const range = this.gridContext.cellMatrix.getRange(this.gridContext.state.focusedLocation, location);
            selectRange(this.gridContext, range);
        } else if (event.ctrlKey) {
            focusLocation(this.gridContext, location)
        } else {
            focusLocation(this.gridContext, location);
        }
    }

    handlePointerMove(event: PointerEvent): void {
        changeBehavior(this.gridContext, new CellSelectionBehavior(this.gridContext));
    }

    handlePointerUp(event: PointerEvent): void {
        console.log('up');
    }

    handleDoubleClick(event: PointerEvent): void {
        console.log('double');
    }

    handleKeyDown(event: KeyboardEvent) {
        console.log('key down')
        keyDownHandlers(this.gridContext, event)
    }
    handleKeyUp(event: KeyboardEvent): void {
        console.log('key up');
        keyUpHandlers(this.gridContext, event)
    }
    handleCopy(event: ClipboardEvent): void {
        event.preventDefault();
    }
    handlePaste(event: ClipboardEvent): void {
        event.preventDefault();
    }
    handleCut(event: ClipboardEvent): void {
        event.preventDefault();
    }

    renderPanePart(pane: Range): React.ReactNode {
        return <></>
    }

    renderGlobalPart(): React.ReactNode {
        return <>

        </>
    }

    dispose(): void {
    }


}