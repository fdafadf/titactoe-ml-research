export class TicTacToe
{
	static CIRCLE = 1;
	static CROSS = 2;
	static SYMBOLS = ['.', 'o', 'x'];
	static FIELDS = [ 0, 1, 2, 3, 4, 5, 6, 7, 8 ];
	static COORDINATES = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }];
	static MASKS = [ 3, 12, 48, 192, 768, 3072, 12288, 49152, 196608 ];
	static O_WINNING_STATES = [ 21, 1344, 4161, 16644, 86016, 66576, 65793, 4368 ];
	static X_WINNING_STATES = [ 42, 2688, 8736, 33288, 172032, 133152, 131586 ];
	static actions = (state) => TicTacToe.FIELDS.filter((_, i) => (state & TicTacToe.MASKS[i]) == 0);
	static isWinnerO = (state) => TicTacToe.O_WINNING_STATES.some(mask => (state & mask) == mask);
	static isWinnerX = (state) => TicTacToe.X_WINNING_STATES.some(mask => (state & mask) == mask);
	static winner = (state) => TicTacToe.isWinnerO(state) ? 1 : (TicTacToe.isWinnerX(state) ? 2 : 0);
	static isFinal = (state) => TicTacToe.actions(state).length == 0 || TicTacToe.winner(state);
	static set = (state, action, value) => state | (value << action * 2);
	static toString = (state) => [0, 3, 6].map(y => [0, 1, 2].map(x => TicTacToe.SYMBOLS[(state >> (y + x) * 2) & 3]).join('')).join("\r\n");
	static field = (state, action) => (state >> action * 2) & 3;
	static action = (x, y) => y * 3 + x;

	constructor() 
	{
		this.actionsCache = new Map();
		this.winnerCache = new Map();
	}

	isFinal = (state) => this.actions(state).length == 0 || this.winner(state);
	actions = (state) => this._value(state, this.actionsCache, TicTacToe.actions);
	winner = (state) => this._value(state, this.winnerCache, TicTacToe.winner);

	_value(state, cache, baseMethod) 
	{
		let value = cache.get(state);
		if (value === undefined) {
			cache.set(state, value = baseMethod(state));
		}
		return value;
	}
}
