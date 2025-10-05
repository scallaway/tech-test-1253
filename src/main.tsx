import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";

import App from "./App.tsx";

ModuleRegistry.registerModules([AllCommunityModule]);

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
