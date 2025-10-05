export type Cell = {
	readonly formula: string;
	readonly result: string | null;
};

export type Row = {
	rowIndex: string;
	[key: number]: Cell;
};
