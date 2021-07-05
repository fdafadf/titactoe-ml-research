import { TicTacToe } from './TicTacToe.js'

export class MinMax
{
	constructor()
	{
		this.items = new Map();
		this.tictactoe = new TicTacToe();
		this._traverse(0, TicTacToe.CIRCLE, TicTacToe.CROSS);
	}

	best(state, player)
	{
		let transitions = this.tictactoe.actions(state).map(action => ({ action, state: TicTacToe.set(state, action, player) }));
		let winningActions = transitions.filter(({ action, state }) => this.items.get(state) == player);
		if (winningActions.length > 0) return winningActions[0];
		let drawActions = transitions.filter(({ action, state }) => this.items.get(state) == 0);
		if (drawActions.length > 0) return drawActions[0];
	}

	_traverse(state, player, opponent)
	{
		let winner = this.tictactoe.winner(state);
		let actions;
		if (winner || (actions = this.tictactoe.actions(state)).length == 0)
		{
			return this._setWinner(state, winner);
		}
		else
		{
			let winners = actions.map(action => this._traverse(TicTacToe.set(state, action, player), opponent, player));
			if (winners.some(w => w == player)) return this._setWinner(state, player);
			if (winners.some(w => w == 0)) return this._setWinner(state, 0);
			return this._setWinner(state, opponent);
		}
	}

	_setWinner(state, player)
	{
		this.items.set(state, player);
		return player;
	}
}