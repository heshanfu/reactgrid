import * as React from 'react';
import { ColumnProps, RowProps, CellMatrixProps, DataChange, Id, MenuOption, Range } from '../../lib/Common';
import { DynaGrid } from '../../lib/Components/DynaGrid';

let COL_COUNT = 5;
let ROW_COUNT = 7;

interface Field {
    id: string;
    width: number;
}

interface Record {
    id: string;
    data: any;
}

export class Spreadsheet extends React.Component<{}, { records: Record[], fields: Field[], focuses: { colId: Id, rowId: Id, color: string }[] }> {

    constructor(props: {}) {
        super(props);

        let cnt = 0;
        const fields = new Array(COL_COUNT).fill(120).map((width, idx) => ({ id: idx.toString(), width }));
        this.state = {
            fields,
            records: new Array(ROW_COUNT).fill(0).map(() => fields.reduce((record: Record, field: Field) => { record.data[field.id] = (cnt++).toString(); return record; }, { id: this.genId(), data: {} })),
            focuses: []
        }
    }

    private genId(): string {
        return Math.random().toString(36).substr(2, 9);
    }

    getRandomInt(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    getRandomWord() {
        const words = [
            'SILEVIS',
            'SOFTWARE',
            'GEFASOFT',
            'SAPIENT',
            'FLEXBASE',
            'DYNAGRID',
            'GERMANEDGE',
        ]
        return words[this.getRandomInt(0, words.length)]
    }

    componentDidMount() {
        let count = 0;
        let focusX = 0;
        let focusY = 0;
        let cnt = 0;
        window.setInterval(() => {
            switch (count++) {
                case 0:
                    focusX = this.getRandomInt(1, COL_COUNT)
                    focusY = this.getRandomInt(1, ROW_COUNT)
                    this.setState({ focuses: [...this.state.focuses, { colId: this.state.fields[focusX].id, rowId: this.state.records[focusY].id, color: '#ffc061' }] })
                    break;
                case 1:
                    this.handleDataChanges([{ columnId: this.state.fields[focusX].id, rowId: this.state.records[focusY].id, type: 'text', initialData: '', newData: this.getRandomWord() }])
                    break;
                case 2:
                    this.setState({ focuses: [...this.state.focuses].filter(f => (f.colId !== this.state.fields[focusX].id) && (f.rowId !== this.state.records[focusY].id)) })
                    break;
                case 3:
                    focusX = this.getRandomInt(1, COL_COUNT)
                    focusY = this.getRandomInt(1, ROW_COUNT)
                    this.setState({ focuses: [{ colId: this.state.fields[focusX].id, rowId: this.state.records[focusY].id, color: '#ffc061' }] })
                    break;
                case 4:
                    this.handleDataChanges([{ columnId: this.state.fields[focusX].id, rowId: this.state.records[focusY].id, type: 'text', initialData: '', newData: this.getRandomWord() }])
                    break;
                case 5:
                    this.setState({ focuses: [...this.state.focuses].filter(f => (f.colId !== this.state.fields[focusX].id) && (f.rowId !== this.state.records[focusY].id)) })
                    break;
                case 6:
                    const records = [...this.state.records]
                    records.splice(ROW_COUNT, 0, this.state.fields.reduce((record: Record, field: Field) => { record.data[field.id] = (cnt++).toString(); return record; }, { id: this.genId(), data: {} }));
                    ROW_COUNT++
                    this.setState({ records })
                    count = 0;
            }
        }, 500)
    }

    private generateCellMatrix(): CellMatrixProps {
        const columns: ColumnProps[] = this.state.fields.map((field, idx) => ({
            id: field.id,
            width: field.width,
            onDrop: (ids) => this.reorderColumns(ids as number[], idx),
            reorderable: true,
            resizable: true,
            onResize: width => { this.state.fields[idx].width = width, this.forceUpdate(); }
        }));

        // const headers: RowProps = { id: 'header', height: 25, reorderable: false, cells: [{ data: '', type: 'header' }].concat(this.state.fields.map(field => ({ data: field.id, type: 'header' }))) };

        const rows: RowProps[] = this.state.records.map((record, rowIdx) => ({
            id: record.id,
            height: 25,
            onDrop: (ids) => this.reorderRows(ids as number[], rowIdx),
            reorderable: true,
            cells: this.state.fields.map((field, colIdx) =>
                rowIdx === 0 ? { data: field.id, type: 'header' }
                    : colIdx === 0 ? { data: record.id, type: 'header' }
                        : { data: record.data[field.id], type: 'text' })
        }));
        return ({ frozenTopRows: 2, frozenLeftColumns: 2, frozenBottomRows: 2, frozenRightColumns: 2, rows, columns })
    }

    private calculateColumnReorder(colIdxs: number[], direction: string, destination: number) {
        const movedColumns: Field[] = this.state.fields.filter((_, idx) => colIdxs.includes(idx));
        const clearedFields: Field[] = this.state.fields.filter((_, idx) => !colIdxs.includes(idx));
        if (direction === 'right') {
            destination = destination - colIdxs.length + 1
        }
        clearedFields.splice(destination, 0, ...movedColumns)
        return clearedFields
    }

    render() {
        let cnt = 0;
        return (<div>
            <button style={{ width: 100, height: 50 }} onClick={() => {
                const records = [...this.state.records];
                records.shift()
                ROW_COUNT--
                this.setState({ records })
            }}>
                - rekord
            </button>
            <button style={{ width: 100, height: 50 }} onClick={() => {
                const records = [...this.state.records];
                records.splice(ROW_COUNT, 0, this.state.fields.reduce((record: Record, field: Field) => { record.data[field.id] = (cnt++).toString(); return record; }, { id: this.genId(), data: {} }));
                ROW_COUNT++
                this.setState({ records })
            }}>
                + rekord
            </button>
            <button style={{ width: 100, height: 50 }} onClick={() => {
                const fields = [...this.state.fields];
                fields.shift()
                COL_COUNT--
                this.setState({ fields })
            }}>
                - kolumn
            </button>
            <button style={{ width: 100, height: 50 }} onClick={() => {
                const fields = [...this.state.fields];
                fields.splice(COL_COUNT, 0, { id: this.genId(), width: 100 })
                COL_COUNT++
                this.setState({ fields })
            }}>
                + kolumn
            </button>
            <DynaGrid style={{ position: 'absolute', top: 50, bottom: 0, left: 0, right: 0, fontFamily: 'Sans-Serif' }}
                cellMatrixProps={this.generateCellMatrix()}
                onDataChanged={changes => this.handleDataChanges(changes)}
                onRowContextMenu={(selectedRowIds: Id[], menuOptions: MenuOption[]) => this.handleRowContextMenu(selectedRowIds, menuOptions)}
                onColumnContextMenu={(selectedColIds: Id[], menuOptions: MenuOption[]) => this.handleColContextMenu(selectedColIds, menuOptions)}
                onRangeContextMenu={(selectedRanges: Range[], menuOptions: MenuOption[]) => this.handleRangeContextMenu(selectedRanges, menuOptions)}
                cellTemplates={{}}
                customFocuses={this.state.focuses}
            />
        </div>
        );
    }

    private handleDataChanges(dataChanges: DataChange[]) {
        const state = { ...this.state }
        dataChanges.forEach(change => {
            state.records.map(r => r.id == change.rowId ? r.data[change.columnId] = change.newData : r)
        })
        this.setState(state)
    }

    private handleRangeContextMenu(selectedRanges: Range[], menuOptions: MenuOption[]): MenuOption[] {
        let selectedRowIds: Id[] = [];
        let selectedColIds: Id[] = [];
        let options = menuOptions.concat([
            {
                title: 'Delete Row',
                handler: () => {
                    this.deleteRows(selectedRowIds);
                }
            },
            {
                title: 'Delete Column',
                handler: () => {
                    this.deleteColumns(selectedColIds);
                }
            }
        ]);

        selectedRanges.forEach((range, idx) => {
            range.cols.forEach((col, colIdx) => {
                selectedColIds.push(col.id);
                range.rows.forEach((row, rowIdx) => {
                    selectedRowIds.push(row.id);
                    if (range.cols[colIdx].idx === 0) {
                        options = options.filter(option => option.title !== 'Delete Column');
                    }
                    if (range.rows[rowIdx].idx === 0) {
                        options = options.filter(option => option.title !== 'Delete Row')
                    }
                })
            })
        });

        // delete duplicated ids
        selectedRowIds = Array.from(new Set(selectedRowIds));
        selectedColIds = Array.from(new Set(selectedColIds));

        return options;
    }

    private handleRowContextMenu(selectedRowIds: Id[], menuOptions: MenuOption[]): MenuOption[] {
        return menuOptions.concat([
            {
                title: 'Delete Row',
                handler: () => {
                    this.deleteRows(selectedRowIds);
                }
            }
        ]);
    }

    private handleColContextMenu(selectedColIds: Id[], menuOptions: MenuOption[]): MenuOption[] {
        return menuOptions.concat([
            {
                title: 'Delete Column',
                handler: () => {
                    this.deleteColumns(selectedColIds)
                }
            }
        ]);
    }

    private deleteRows(selectedRowIds: Id[]) {
        const records = [...this.state.records].filter(r => !selectedRowIds.toString().includes(r.id));
        this.setState({ records })
    }

    private deleteColumns(selectedColIds: Id[]) {
        const fields = [...this.state.fields].filter(f => !selectedColIds.toString().includes(f.id));
        this.setState({ fields })
    }

    private reorderColumns(colIdxs: number[], to: number) {
        let fields = [...this.state.fields];
        if (to > colIdxs[0]) {
            fields = this.calculateColumnReorder(colIdxs, 'right', to)
        } else {
            fields = this.calculateColumnReorder(colIdxs, 'left', to)
        }
        this.setState({ fields })
    }

    private reorderRows(rowIdxs: number[], to: number) {
        const records = [...this.state.records];
        const movedRecords = records.filter((_, idx) => rowIdxs.includes(idx));
        const clearedRecords = records.filter((_, idx) => !rowIdxs.includes(idx));
        if (to > rowIdxs[0])
            to = to - rowIdxs.length + 1
        clearedRecords.splice(to, 0, ...movedRecords)
        this.setState({ records: clearedRecords })
    }
}