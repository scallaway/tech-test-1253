import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { produce } from "immer";
import { AgGridReact } from "ag-grid-react";
import {
	AUTO_SIZE_STRATEGY,
	COLUMNS,
	DEFAULT_COLUMN_DEF,
	THEME,
	type Row,
} from "./gridOptions";
import type { CellEditingStoppedEvent, IRowNode } from "ag-grid-community";
import type { WorkerResponse } from "./worker";

function App() {
	const gridRef = useRef<AgGridReact | null>(null);
	const worker = useMemo(
		() => new Worker(new URL("./worker.ts", import.meta.url)),
		[],
	);

	const [rowData] = useState(() =>
		Array.from({ length: 10 }).map((_, rowIndex) =>
			Object.fromEntries(
				COLUMNS.map((column, columnIndex) => [
					[column.field],
					columnIndex === 0 ? rowIndex + 1 : null,
				]),
			),
		),
	);

	const handleCellEdit = useCallback(
		(event: CellEditingStoppedEvent) => {
			if (!event.newValue) {
				return;
			}
			// TODO: Type these worker messages all the way through as there are no
			// compile-time guarantees atm
			worker.postMessage({
				text: event.newValue,
				oldValue: event.oldValue,
				rowIndex: event.rowIndex,
				columnId: event.column.getColId(),
			});
		},
		[worker],
	);

	const publishResultToCell = useCallback((response: WorkerResponse) => {
		// We're trying to update the grid before it's even ready
		if (!gridRef.current) {
			return;
		}

		const rowNode: IRowNode<Row> | undefined = gridRef.current.api.getRowNode(
			response.rowIndex.toString(),
		);
		if (!rowNode || !rowNode.data) {
			return;
		}

		rowNode.updateData(
			produce(rowNode.data, (draft) => {
				draft[response.columnId] = response.result;
			}),
		);
	}, []);

	useEffect(() => {
		worker.onmessage = (e: MessageEvent<WorkerResponse>) => {
			publishResultToCell(e.data);
		};
	}, [publishResultToCell, worker]);

	return (
		<div style={{ height: 475, width: 700, overflow: "scroll" }}>
			<AgGridReact
				ref={gridRef}
				defaultColDef={DEFAULT_COLUMN_DEF}
				rowData={rowData}
				columnDefs={COLUMNS}
				autoSizeStrategy={AUTO_SIZE_STRATEGY}
				theme={THEME}
				onCellEditingStopped={handleCellEdit}
			/>
		</div>
	);
}

export default App;
