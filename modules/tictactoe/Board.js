import { TicTacToe } from './TicTacToe.js'

export class Board
{
	constructor() 
	{
		const row_template = '<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>';
		this.element = document.createElement('table');
		this.element.classList.add('board');
		this.element.innerHTML = `${row_template}${row_template}${row_template}`;
		this.symbols = ['', 'O', '✖'];
		this.element.querySelectorAll('tr').forEach((tr, index) => tr.boardY = index);
		this.element.querySelectorAll('tr').forEach(tr => tr.querySelectorAll('td').forEach((td, index) => td.boardX = index));
		this.element.querySelectorAll('td').forEach(td => td.onclick = this._onClick.bind(this));
		this.player = 1;
		this.opponent = 2;
		this.onFieldSelected = _ => { };
	}

	set state(value) 
	{
		this.state_value = value;
		[0, 1, 2].forEach(y => [0, 1, 2].forEach(x => this._setField(x, y, this.symbols[TicTacToe.field(value, y * 3 + x)])));
	}

	play(x, y) 
	{
		this.state = TicTacToe.set(this.state_value, y * 3 + x, this.player);
		[this.player, this.opponent] = [this.opponent, this.player];
	}

	_setField(x, y, value) 
	{
		this.element.querySelectorAll('tr')[y].querySelectorAll('td')[x].innerText = value;
	}

	_onClick(e) 
	{
		let x = e.target.boardX;
		let y = e.target.parentElement.boardY;
		this.onFieldSelected({ x, y });
	}
}