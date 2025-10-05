import { evaluate } from "mathjs";

// math.js actually supports a lot more operations than this, but for the
// purposes of the tech test this is a sufficient subset
const EXPRESSION_REGEX = /(\*)+|(\+)+|(-)+/g;

export type WorkerRequest = {
	readonly columnId: number;
	readonly rowIndex: number;
	readonly oldValue: string;
	readonly formula: string;
};

export type WorkerResponse = {
	readonly columnId: number;
	readonly rowIndex: number;
	readonly result: string;
};

self.onmessage = ({ data }: MessageEvent<WorkerRequest>) => {
	const base = {
		columnId: data.columnId,
		rowIndex: data.rowIndex,
	};

	if (!data.formula.startsWith("=")) {
		const expressionMatches = [...data.formula.matchAll(EXPRESSION_REGEX)];

		// If a formula is passed, but doesn't start with an equals sign, then
		// ignore it and return the current value
		if (expressionMatches.length) {
			return self.postMessage({
				...base,
				result: data.oldValue,
			});
		}

		return self.postMessage({
			...base,
			result: data.formula,
		});
	}

	const result = evaluate(data.formula.slice(1));

	// TODO: Handle text values
	self.postMessage({
		...base,
		result,
	});
};
