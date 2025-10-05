import { evaluate } from "mathjs";

// math.js actually supports a lot more operations than this, but for the
// purposes of the tech test this is a sufficient subset
const EXPRESSION_REGEX = /(\*)+|(\+)+|(-)+/g;

export type WorkerRequest = {
	readonly columnId: number;
	readonly rowIndex: number;
	readonly oldValue: string;
	readonly formula: string;
	readonly cellValueMapping: Map<string, number>;
};

export type WorkerResponse = {
	readonly columnId: number;
	readonly rowIndex: number;
	readonly result: string;
	readonly formula: string;
};

self.onmessage = ({ data }: MessageEvent<WorkerRequest>) => {
	const base = {
		columnId: data.columnId,
		rowIndex: data.rowIndex,
		formula: data.formula,
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

	const result = evaluate(
		replaceCellValues(data.formula.slice(1), data.cellValueMapping),
	);

	self.postMessage({
		...base,
		result,
	});
};

const CELL_MATCH_REGEX = /([A-Za-z]+[0-9]+)/g;

const replaceCellValues = (
	formula: string,
	cellsToValue: Map<string, number>,
): string => {
	// NOTE: This could be improved as we're matching on Regex twice
	// The first time so we can isolate the cell values, the second time to
	// ensure we only look in the Map if we need to
	return formula
		.split(CELL_MATCH_REGEX)
		.filter(Boolean)
		.map((value) => {
			if (value.match(CELL_MATCH_REGEX)) {
				return cellsToValue.get(value);
			}

			return value;
		})
		.join("");
};
