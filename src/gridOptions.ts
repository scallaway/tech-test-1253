import { themeQuartz, type ColDef } from "ag-grid-community";
import type { AgGridReact } from "ag-grid-react";
import type { ComponentProps } from "react";

export const DEFAULT_COLUMN_DEF = {
	width: 100,
	resizable: false,
	sortable: false,
	editable: true,
} satisfies ColDef;

export const COLUMNS = [
	{
		headerName: "",
		field: "rowIndex",
		headerStyle: { width: 50 },
		cellEditor: "agTextCellEditor",
	},
	...Array.from({ length: 7 }).map((_, i) => ({
		field: String.fromCharCode(65 + i).toLocaleUpperCase(),
		cellEditor: "agTextCellEditor",
	})),
]; // I think the types for columnDefs are slightly wrong (even the setup
// tutorial didn't compile properly)

export type Row = {
	rowIndex: string;
	[key: number]: string;
};

export const THEME = themeQuartz.withParams({
	borderColor: "#000",
	headerColumnBorder: { style: "solid" },
	columnBorder: { style: "solid" },
});

export const AUTO_SIZE_STRATEGY = {
	type: "fitCellContents",
	skipHeader: true,
} satisfies ComponentProps<typeof AgGridReact>["autoSizeStrategy"];
