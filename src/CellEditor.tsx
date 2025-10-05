import type { CustomCellEditorProps } from "ag-grid-react";
import { memo, type FC } from "react";
import { type Cell } from "./types";

export const CellEditor: FC<CustomCellEditorProps<Cell>> = memo((props) => {
	return (
		<input
			type="text"
			value={props.value.formula}
			onChange={({ target: { value } }) =>
				props.onValueChange({ ...props.value, formula: value })
			}
			style={{
				height: "100%",
				width: "100%",
				padding: 0,
				margin: 0,
			}}
			autoFocus
		/>
	);
});
