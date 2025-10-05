import { memo, useCallback, useRef, type FC, type RefObject } from "react";
import { AgGridReact } from "ag-grid-react";
import {
	COLUMNS,
	DATA_TYPE_DEFINITIONS,
	DEFAULT_COLUMN_DEF,
	THEME,
} from "./config";
import { type CellEditRequestEvent, type ColDef } from "ag-grid-community";
import { retrieveCellValues } from "../utils";

const ROW_DATA = Array.from({ length: 20 }).map((_, rowIndex) =>
	Object.fromEntries(
		COLUMNS.map((column, columnIndex) => [
			[column.field],
			{ formula: "", result: columnIndex === 0 ? rowIndex + 1 : null },
		]),
	),
);

export const Grid: FC<{
	readonly gridRef: RefObject<AgGridReact | null>;
	readonly worker: RefObject<Worker | null>;
}> = memo(function Grid({ gridRef, worker }) {
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
		[gridRef, worker],
	);

	return (
		<AgGridReact
			ref={gridRef}
			defaultColDef={DEFAULT_COLUMN_DEF}
			rowData={ROW_DATA}
			columnDefs={
				// NOTE: It looks as though the types for "columnDefs" is a bit odd...
				// Would require further investigation
				COLUMNS as Array<ColDef>
			}
			theme={THEME}
			gridOptions={{ readOnlyEdit: true }}
			onCellEditRequest={handleCellEdit}
			dataTypeDefinitions={DATA_TYPE_DEFINITIONS}
		/>
	);
});
