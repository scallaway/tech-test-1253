export type WorkerRequest = {
	readonly columnId: number;
	readonly rowIndex: number;
	readonly oldValue: string;
	readonly text: string;
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

	// All spreadsheet formulae should start with an "="
	if (!data.text.startsWith("=")) {
		self.postMessage({
			...base,
			result: data.oldValue,
		});
	}

	const values = data.text.slice(1).split("+");

	const result = values.reduce((acc, val) => acc + Number(val), 0);

	// TODO: Handle text values
	self.postMessage({
		...base,
		result,
	});
};
