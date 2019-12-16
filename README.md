#### Prerequisites
The only requirement in order to make ReactGrid work is an installed ReactJS library.

## 1. Install ReactGrid from npm repository

```shell
npm i @silevis/reactgrid
```

Before run you need to have globally installed:
- "react": "^16.8.6"
- "react-dom": "^16.8.6"

## 2. Import ReactGrid component

```tsx
import { ReactGrid } from "@silevis/reactgrid";
```

## 3. Import css styles

Import file from `node_modules` directory. This file is necessary to correctly displaying.

```tsx
import "/node_modules/@silevis/reactgrid/dist/lib/assets/core.css";
```

## 4. Create a cell matrix

Time to define our data. It will be stored in [React Hook](https://reactjs.org/docs/hooks-intro.html). 
`useState` hook will be initialized with object that contains two keys - `columns` and `rows`. 
Both of them must be valid ReactGrid objects: [`Columns`](link) and [`Rows`](link).

```tsx
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { ReactGrid } from "@silevis/reactgrid";
import "./../node_modules/@silevis/reactgrid/dist/lib/assets/core.css";

function App() {
  const [state, setState] = useState(() => ({
    columns: [
      { columnId: "Name", width: 100 },
      { columnId: "Surname", width: 100 }
    ],
    rows: [
      {
        rowId: 0,
        cells: [
          { type: "header", text: "Name" },
          { type: "header", text: "Surname" }
        ]
      },
      {
        rowId: 1,
        cells: [
          { type: "text", text: "Thomas" },
          { type: "text", text: "Goldman" }
        ]
      },
      {
        rowId: 2,
        cells: [
          { type: "text", text: "Susie" },
          { type: "text", text: "Spencer" }
        ]
      },
      {
        rowId: 2,
        cells: [{ type: "text", text: "" }, { type: "text", text: "" }]
      }
    ]
  }));

  return (
    <ReactGrid
      rows={state.rows}
      columns={state.columns}
      license={"non-commercial"}
    />
  );
}
```

## 4. Render your component

```tsx
const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

## Documentation

Browse docs: [click](http://reactgrid.com/docs/2.0.30/0-introduction/)

## Pricing and licensing

ReactGrid if free for non-commercial use, read more about [pricing and licensing](http://reactgrid.com/pricing)