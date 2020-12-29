import {
	getToken, TT, Token,
} from './token';

const WHITESPACE = ['\t', ' ', '\n'];
const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const KEYWORDS = {
	MUT: getToken(TT.MUT, 'MUT'),
	BEGIN: getToken(TT.BEGIN, 'BEGIN'),
	END: getToken(TT.END, 'END')
}

const isDigit = (char: string) => DIGITS.includes(char);
const isWhiteSpace = (char: string) => WHITESPACE.includes(char); 
const isAlphaUs = (char: string) => /^[_a-zA-Z]+$/i.test(char);
const isVarname = (char: string) => /^[_a-zA-Z0-9]+$/i.test(char);

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

	_id() {
		let result = '';

		while (this.currentChar !== null && isVarname(this.currentChar)) {
			result += this.currentChar;
			this.advance();
		}

		let token = KEYWORDS[result.toUpperCase()];
		return token;
	}

	advance(count?: number) {
		this.pos += count ?? 1;

		if (this.pos > this.text.length - 1) {
			this.currentChar = null;
		}
		else {
			this.currentChar = this.text[this.pos]
		}

	}

	peek() {
		let peekPos = this.pos + 1;

		if (peekPos > this.text.length -1) {
			return null;
		}

		return this.text[peekPos];
	}
	// TODO: String lexing
	// TODO: Refactor branching for char comparisons to hash lookup
	getNextToken(): Token {
		while (this.currentChar !== null) {
			const char = this.currentChar;

			if (isWhiteSpace(this.currentChar)) {
				// Recursively call getNextToken on whitespace
				this.advance();
				return this.getNextToken();
			}

			if (isAlphaUs(this.currentChar)) {
				return this._id();
			}

			if (this.currentChar === ':' && this.peek() === '=') {
				this.advance(2);
				
				return getToken(TT.I_ASSIGN, ':=')
			}

			if (this.currentChar === '.'){
				this.advance();

				return getToken(TT.DOT, '.')
			}

			if (this.currentChar === ':' && this.peek() === ':') {
				this.advance(2);

				return getToken(TT.FUNC, '::')
			}
			
			if (this.currentChar === '{') {
				this.advance();

				return getToken(TT.LBRACE, '{');
			}

			if (this.currentChar === '}') {
				this.advance();

				return getToken(TT.RBRACE, '}');
			}

			if (this.currentChar === ';') {
				return getToken(TT.SEMI, ';')
			}
			
			if (isDigit(this.currentChar)) {
				console.log('digit found');
				return getToken(TT.INT, this.integer());
			}
			
			if (char === '+') {
				this.advance();
				return getToken(TT.PLUS, '+')
			}
			
			if (char === '-') {
				this.advance();
				return getToken(TT.MINUS, '-')
			}

			if (char === '/') {
				this.advance()
				return getToken(TT.DIV, '/')
			}
			
			if (char === '*') {
				this.advance()
				return getToken(TT.MUL, '*')
			}
			
			if (char === '(') {
				this.advance()
				return getToken(TT.LPAREN, '(')
			}
			
			if (char === ')') {
				this.advance()
				return getToken(TT.RPAREN, ')')
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