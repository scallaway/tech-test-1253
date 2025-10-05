import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
	ClientSideRowModelModule,
	ColumnAutoSizeModule,
	ModuleRegistry,
	RowApiModule,
	TextEditorModule,
	ValidationModule,
} from "ag-grid-community";

import App from "./App.tsx";

ModuleRegistry.registerModules([
	ColumnAutoSizeModule,
	ClientSideRowModelModule,
	RowApiModule,
	TextEditorModule,
	ValidationModule,
]);

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
