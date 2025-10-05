import { evaluate } from "mathjs";

export type WorkerRequest = {
	readonly columnId: number;
	readonly rowIndex: number;
	readonly oldValue: string;
	readonly formula: string;
};

export type WorkerResponse = {
	readonly columnId: number;
	readonly rowIndex: number;
	readonly result: number;
};

self.onmessage = ({ data }: MessageEvent<WorkerRequest>) => {
	const base = {
		columnId: data.columnId,
		rowIndex: data.rowIndex,
	};

	// All spreadsheet formulae should start with an "="
	if (!data.formula.startsWith("=")) {
		self.postMessage({
			...base,
			result: data.oldValue,
		});
	}

	const result = evaluate(data.formula.slice(1));

	// TODO: Handle text values
	self.postMessage({
		...base,
		result,
	});
};
