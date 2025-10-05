import { themeQuartz, type ColDef } from "ag-grid-community";
import type { AgGridReact } from "ag-grid-react";
import { type ComponentProps } from "react";
import { CellEditor } from "./CellEditor";

export const DEFAULT_COLUMN_DEF = {
	width: 100,
	sortable: false,
	editable: true,
	resizable: false, // This and auto resizing aren't the most reliable it seems
} satisfies ColDef;

export const COLUMNS = [
	{
		headerName: "",
		field: "rowIndex",
		editable: false,
		pinned: "left",
		width: 50,
	},
	...Array.from({ length: 10 }).map((_, i) => ({
		field: String.fromCharCode(65 + i).toLocaleUpperCase(),
		cellEditor: CellEditor,
		cellEditorParams: {
			useFormatter: true,
		},
		cellDataType: "object",
	})),
];

export const DATA_TYPE_DEFINITIONS = {
	object: {
		baseDataType: "object",
		extendsDataType: "object",
		valueFormatter: ({ value }) => value.result ?? "",
	},
} satisfies ComponentProps<typeof AgGridReact>["dataTypeDefinitions"];

export const THEME = themeQuartz.withParams({
	headerColumnBorder: { style: "solid" },
	fontFamily: "monospace",
	columnBorder: { style: "solid" },
});
