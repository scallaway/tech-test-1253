import invariant from "tiny-invariant";
import { memo, useCallback, useEffect, useRef, type RefObject } from "react";
import "./App.css";
import { produce } from "immer";
import { AgGridReact } from "ag-grid-react";
import {
	AUTO_SIZE_STRATEGY,
	COLUMNS,
	DATA_TYPE_DEFINITIONS,
	DEFAULT_COLUMN_DEF,
	THEME,
} from "./gridOptions";
import { type Row } from "./types";
import { type CellEditRequestEvent, type IRowNode } from "ag-grid-community";
import type { WorkerResponse } from "./worker";

const ROW_DATA = Array.from({ length: 10 }).map((_, rowIndex) =>
	Object.fromEntries(
		COLUMNS.map((column, columnIndex) => [
			[column.field],
			{ formula: "", result: columnIndex === 0 ? rowIndex + 1 : null },
		]),
	),
);

const App = memo(function App() {
	const gridRef = useRef<AgGridReact | null>(null);
	const worker = useRef<Worker | null>(null);

	const handleCellEdit = useCallback(
		(event: CellEditRequestEvent) => {
			if (!event.newValue.formula || !gridRef.current) {
				return;
			}

			// TODO: Type these worker messages all the way through as there are no
			// compile-time guarantees at the moment
			worker.current?.postMessage({
				formula: event.newValue.formula,
				cellValueMapping: retrieveCellValues(
					event.newValue.formula,
					gridRef.current,
				),
				oldValue: event.oldValue.result,
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
		<div style={{ height: 475, width: 700, overflow: "scroll" }}>
			<AgGridReact
				ref={gridRef}
				defaultColDef={DEFAULT_COLUMN_DEF}
				rowData={ROW_DATA}
				columnDefs={COLUMNS}
				autoSizeStrategy={AUTO_SIZE_STRATEGY}
				theme={THEME}
				gridOptions={{ readOnlyEdit: true }}
				onCellEditRequest={handleCellEdit}
				dataTypeDefinitions={DATA_TYPE_DEFINITIONS}
			/>
		</div>
	);
});

export default App;

const CELL_MATCH_REGEX = /([A-Za-z]+[0-9]+)/g;

/**
 * Returns a mapping of the cell references to the value of those cells
 */
const retrieveCellValues = (
	formula: string,
	gridRef: RefObject<AgGridReact>["current"],
): Map<string, number> => {
	const cells = [...formula.matchAll(CELL_MATCH_REGEX)].map(
		(match) => match.at(0)!,
	);

	return new Map(
		cells.map((cell) => {
			const rowNode = gridRef.api.getRowNode(
				(Number(cell.slice(1)) - 1).toString(),
			);
			invariant(
				rowNode,
				`No row found for index: ${Number(cell.slice(1)) - 1}`,
			);

			return [
				cell,
				gridRef.api.getCellValue({
					rowNode,
					colKey: cell.slice(0, 1),
				}).result ?? 0,
			];
		}),
	);
};
