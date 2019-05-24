import { PointerEvent, Location } from "./";
import { GridContext } from "./GridContext";
import { getLocationFromClient, scrollIntoView } from "../Functions";

export class PointerEventsController {
    private eventTimestamps: number[] = [0, 0];
    private eventLocations: Array<Location | undefined> = [undefined, undefined]
    private currentIndex: number = 0;

    constructor(private gridContext: GridContext) { }

    public handlePointerDown = (event: PointerEvent) => {

        // TODO open context menu (long hold tap)

        if (event.button !== 0)
            return

        window.addEventListener('pointermove', this.handlePointerMove as any);
        window.addEventListener('pointerup', this.handlePointerUp as any);
        const currentLocation = getLocationFromClient(this.gridContext, event.clientX, event.clientY);
        this.currentIndex = 1 - this.currentIndex;
        this.eventTimestamps[this.currentIndex] = new Date().valueOf();
        this.eventLocations[this.currentIndex] = currentLocation;
        this.gridContext.currentBehavior.handlePointerDown(event, currentLocation);
    }

    private handlePointerMove = (event: PointerEvent) => {
        const autoScrollDirection = this.gridContext.currentBehavior.autoScrollDirection;
        const currentLocation = getLocationFromClient(this.gridContext, event.clientX, event.clientY, autoScrollDirection);
        //if (!isFullyVisible(currentLocation)) {
        scrollIntoView(this.gridContext, currentLocation, autoScrollDirection);
        //}
        this.gridContext.currentBehavior.handlePointerMove(event, currentLocation);
        const previousLocation = this.eventLocations[this.currentIndex];
        this.eventLocations[this.currentIndex] = currentLocation;
        if (!isSameLocation(previousLocation, currentLocation)) {
            this.gridContext.currentBehavior.handlePointerEnter(event, currentLocation);
        }
    }

    private handlePointerUp = (event: PointerEvent) => {
        if (event.button !== 0)
            return

        window.removeEventListener('pointerup', this.handlePointerUp as any);
        window.removeEventListener('pointermove', this.handlePointerMove as any);
        const currentLocation = getLocationFromClient(this.gridContext, event.clientX, event.clientY);
        const currentTimestamp = new Date().valueOf();
        const secondLastTimestamp = this.eventTimestamps[1 - this.currentIndex];
        this.gridContext.currentBehavior.handlePointerUp(event, currentLocation);
        if (currentTimestamp - secondLastTimestamp < 3500 && isSameLocation(currentLocation, this.eventLocations[0]) && isSameLocation(currentLocation, this.eventLocations[1])) {
            this.gridContext.currentBehavior.handleDoubleClick(event, currentLocation)
        }
    }
}

function isSameLocation(location1?: Location, location2?: Location): boolean {
    return location1 !== undefined
        && location2 !== undefined
        && location1.col.idx === location2.col.idx
        && location1.row.idx === location2.row.idx;
}

