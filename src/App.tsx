import { useState, type ComponentProps } from "react";
import { AgGridReact } from "ag-grid-react";
import { themeQuartz, type ColDef } from "ag-grid-community";

const DEFAULT_COLUMN_DEF = {
	width: 100,
	resizable: false,
	sortable: false,
} satisfies ColDef;

const COLUMNS = [
	{
		headerName: "",
		field: "rowIndex",
		headerStyle: { width: 50 },
	},
	...Array.from({ length: 7 }).map((_, i) => ({
		field: String.fromCharCode(65 + i).toLocaleUpperCase(),
	})),
]; // I think the types for columnDefs are slightly wrong (even the setup
// tutorial didn't compile properly)

const THEME = themeQuartz.withParams({
	borderColor: "#000",
	headerColumnBorder: { style: "solid" },
	columnBorder: { style: "solid" },
});

const AUTO_SIZE_STRATEGY = {
	type: "fitCellContents",
	skipHeader: true,
} satisfies ComponentProps<typeof AgGridReact>["autoSizeStrategy"];

function App() {
	const [rowData, setRowData] = useState(() =>
		Array.from({ length: 10 }).map((_, rowIndex) =>
			Object.fromEntries(
				COLUMNS.map((column, columnIndex) => [
					[column.field],
					columnIndex === 0 ? rowIndex + 1 : null,
				]),
			),
		),
	);

	return (
		<div style={{ height: 475, width: 700, overflow: "scroll" }}>
			<AgGridReact
				defaultColDef={DEFAULT_COLUMN_DEF}
				rowData={rowData}
				columnDefs={COLUMNS}
				autoSizeStrategy={AUTO_SIZE_STRATEGY}
				theme={THEME}
			/>
		</div>
	);
}

export default App;
