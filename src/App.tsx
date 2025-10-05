import { memo, useCallback, useEffect, useRef } from "react";
import { produce } from "immer";
import { AgGridReact } from "ag-grid-react";
import { type Row } from "./utils";
import { type IRowNode } from "ag-grid-community";
import type { WorkerResponse } from "./worker";
import { Grid } from "./Grid";

const App = memo(function App() {
	const gridRef = useRef<AgGridReact | null>(null);
	const worker = useRef<Worker | null>(null);

	const publishResultToCell = useCallback((response: WorkerResponse) => {
		// We're trying to update the grid before it's even ready
		if (!gridRef.current) {
			return;
		}

		const rowNode: IRowNode<Row> | undefined = gridRef.current.api.getRowNode(
			response.rowIndex.toString(),
		);

		// TODO: This should _probably_ be an invariant instead
		if (!rowNode || !rowNode.data) {
			return;
		}

		rowNode.updateData(
			produce(rowNode.data, (draft) => {
				draft[response.columnId].result = response.result;
				draft[response.columnId].formula = response.formula;
			}),
		);
	}, []);

	useEffect(() => {
		worker.current = new Worker(new URL("./worker.ts", import.meta.url), {
			type: "module",
		});

		worker.current.onmessage = (e: MessageEvent<WorkerResponse>) => {
			publishResultToCell(e.data);
		};

		return () => {
			worker.current?.terminate();
		};
	}, [publishResultToCell, worker]);

	return (
		<div
			style={{
				color: "#eee",

				fontFamily: "sans-serif",
			}}
		>
			<h1>Spreadsheet tech test</h1>
			<h2>Built with React, Typescript & AgGrid</h2>
			<div
				style={{ height: 475, width: 800, overflow: "scroll" }}
				data-ag-theme-mode="dark"
			>
				<Grid gridRef={gridRef} worker={worker} />
			</div>
			<p>
				All cells (outside of the index and header cells) are editable allowing
				for references to other cells as well (by typing, not clicking)
			</p>
		</div>
	);
});

export default App;
