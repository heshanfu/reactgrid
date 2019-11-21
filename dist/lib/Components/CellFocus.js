import * as React from 'react';
export var CellFocus = function (props) { return (React.createElement("div", { key: props.color, className: "rg-cell-focus " + (props.className || ''), style: {
        top: props.location.row.top - (props.location.row.top === 0 ? 0 : 1),
        left: props.location.column.left - (props.location.column.left === 0 ? 0 : 1),
        width: props.location.column.width + (props.location.column.left === 0 ? 0 : 1),
        height: props.location.row.height + (props.location.row.top === 0 ? 0 : 1),
        borderColor: "" + props.color,
    } })); };
