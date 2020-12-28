import {
	getToken, TT, Token,
} from './Token';

const WHITESPACE = ['\t', ' ', '\n'];
const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

const isDigit = (char: string) => DIGITS.includes(char);
const isWhiteSpace = (char: string) => WHITESPACE.includes(char); 

export class Lexer {
	text: string;
	pos: number;
	currentChar: string;

	constructor(text: string) {
		this.text = text;
		this.pos = 0;
		this.currentChar = this.text[this.pos];
	}

	error() {
		return new Error('Invalid character at position ' + this.pos)
	}

	advance() {
		this.pos++

		if (this.pos > this.text.length - 1) {
			this.currentChar = null;
		}
		else {
			this.currentChar = this.text[this.pos]
		}

	}

	getNextToken(): Token {
		while (this.currentChar !== null) {
			const char = this.currentChar;

			if (isWhiteSpace(this.currentChar)) {
				// Recursively call getNextToken on whitespace
				this.advance();
				return this.getNextToken();
			}
			
			if (isDigit(this.currentChar)) {
				return getToken(TT.INT, this.integer());
			}
			
			if (char === '+') {
				this.advance();
				return getToken(TT.PLUS)
			}
			
			if (char === '-') {
				this.advance();
				return getToken(TT.MINUS)
			}

			if (char === '/') {
				this.advance()
				return getToken(TT.DIV)
			}
			
			if (char === '*') {
				this.advance()
				return getToken(TT.MUL)
			}
			
			if (char === '(') {
				this.advance()
				return getToken(TT.LPAREN)
			}
			
			if (char === ')') {
				this.advance()
				return getToken(TT.RPAREN)
			}
				
			this.error();	
		}

		return getToken(TT.EOF, null);
	}

	integer() {
		let numStr = '';

		while (this.currentChar !== null && isDigit(this.currentChar)) {
			numStr += this.currentChar;
			this.advance();
		}
		
		return parseInt(numStr);
	}
}