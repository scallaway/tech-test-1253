import type { AgGridReact } from "ag-grid-react";
import type { RefObject } from "react";
import invariant from "tiny-invariant";

export type Cell = {
	readonly formula: string;
	readonly result: string | null;
};

export type Row = {
	rowIndex: string;
	[key: number]: Cell;
};

const CELL_MATCH_REGEX = /([A-Za-z]+[0-9]+)/g;

/**
 * Returns a mapping of the cell references to the value of those cells
 */
export const retrieveCellValues = (
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
