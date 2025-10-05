import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
	CellApiModule,
	ClientSideRowModelModule,
	ColumnAutoSizeModule,
	CustomEditorModule,
	ModuleRegistry,
	RowApiModule,
	TextEditorModule,
	ValidationModule,
} from "ag-grid-community";

import App from "./App.tsx";

ModuleRegistry.registerModules([
	CellApiModule,
	ColumnAutoSizeModule,
	ClientSideRowModelModule,
	CustomEditorModule,
	RowApiModule,
	TextEditorModule,
	ValidationModule,
]);

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
