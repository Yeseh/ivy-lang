import {
	getToken, TT, Token,
} from './token';

const WHITESPACE = ['\t', ' '];
const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const KEYWORDS = {
	BEGIN: getToken(TT.BEGIN, 'BEGIN'),
	END: getToken(TT.END, 'END'),
	VAR: getToken(TT.VAR, 'VAR'),
	PROGRAM: getToken(TT.PROGRAM, 'PROGRAM'),

	INT: getToken(TT.INT, 'INT'),
	FLOAT: getToken(TT.FLOAT, 'INT'),
	STRING: getToken(TT.STRING, 'STRING'),

	IF: getToken(TT.IF, 'IF'),
	ELIF: getToken(TT.ELIF, 'ELIF'),
	ELSE: getToken(TT.ELSE, 'ELSE'),


};

const isDigit = (char: string) => DIGITS.includes(char);
const isWhiteSpace = (char: string) => WHITESPACE.includes(char);
const isAlphaUs = (char: string) => /^[_a-zA-Z]+$/i.test(char);
const isVarname = (char: string) => /^[_a-zA-Z0-9]+$/i.test(char);

export class Lexer {
	text: string;
	pos: number;
	line: number;
	char: number;
	currentChar: string;

	constructor(text: string) {
		this.text = text;
		this.pos = 0;
		this.line = 1;
		this.char = 0;
		this.currentChar = this.text[this.pos];
	}

	error() {
		return new Error(`Invalid character at ${this.line}:${this.char}`);
	}

	_id() {
		let result = '';

		while (this.currentChar !== null && isVarname(this.currentChar)) {
			result += this.currentChar;
			this.advance();
		}

		const token = KEYWORDS[result.toUpperCase()]
			?? getToken(TT.ID, result);

		return token;
	}

	advance(count?: number) {
		this.pos += count ?? 1;
		this.char += count ?? 1;

		if (this.pos > this.text.length - 1) {
			this.currentChar = null;
		}
		else {
			this.currentChar = this.text[this.pos];
		}
	}

	skipToEndOfLine() {
		while (this.currentChar !== '\n') {
			this.advance();
		}
	}

	skipMultilineComment() {
		while (this.currentChar !== '*' && this.peekNextChar() !== '/') {
			this.advance();
		}

		this.advance(2);
	}

	peekNextChar() {
		const peekPos = this.pos + 1;

		if (peekPos > this.text.length -1) {
			return null;
		}

		return this.text[peekPos];
	}

	/** Helper method to fill out current KEYWORD token */
	peekToken() {
		let result = this.currentChar;
		let pos = this.pos;

		while (this.currentChar !== ' ') {
			pos++;
			result += this.text[pos];
		}

		// Attempt to find keyword
		const token = KEYWORDS[result];
		// advance(result.length) in getNextToken
		// If undef -> make ID
		return token;
	}

	// TODO: String lexing
	// TODO: Refactor to several functions to lookup tokens, decreasing complexity
	getNextToken(): Token {
		while (this.currentChar !== null) {
			const char = this.currentChar;

			if (isWhiteSpace(this.currentChar)) {
				this.advance();
				return this.getNextToken();
			}

			if (isAlphaUs(this.currentChar)) {
				// Try to match KEYWORD else return lexeme
				return this._id();
			}

			if (this.currentChar === '\n') {
				this.advance();
				this.line++;
				this.char = 0;
			}

			if (this.currentChar === ':' && this.peekNextChar() === '=') {
				this.advance(2);

				return getToken(TT.I_ASSIGN, ':=');
			}

			if (this.currentChar === '.') {
				this.advance();

				return getToken(TT.DOT, '.');
			}

			// Function assignment
			if (this.currentChar === ':' && this.peekNextChar() === ':') {
				this.advance(2);

				return getToken(TT.F_ASSIGN, '::');
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
				this.advance();

				return getToken(TT.SEMI, ';');
			}

			if (isDigit(this.currentChar)) {
				return this.number();
			}

			// Single-line comments
			if (this.currentChar === '/' && this.peekNextChar() === '/') {
				this.advance(2);
				this.skipToEndOfLine();
				return this.getNextToken();
			}

			// Multi line comments
			if (this.currentChar === '/' && this.peekNextChar() === '*') {
				this.advance(2);
				this.skipMultilineComment();
				return this.getNextToken();
			}

			if (char === ',') {
				this.advance();
				return getToken(TT.COMMA, ',');
			}

			if (char === ':') {
				this.advance();
				return getToken(TT.COLON, ':');
			}

			if (char === '+') {
				this.advance();
				return getToken(TT.PLUS, '+');
			}

			if (char === '-') {
				this.advance();
				return getToken(TT.MINUS, '-');
			}

			if (char === '/') {
				this.advance();
				return getToken(TT.DIV, '/');
			}

			if (char === '*') {
				this.advance();
				return getToken(TT.MUL, '*');
			}

			if (char === '(') {
				this.advance();
				return getToken(TT.LPAREN, '(');
			}

			if (char === ')') {
				this.advance();
				return getToken(TT.RPAREN, ')');
			}


			this.error();
		}

		return getToken(TT.EOF, null);
	}

	number() {
		let result = '';

		while (this.currentChar !== null && isDigit(this.currentChar)) {
			result += this.currentChar;
			this.advance();
		}

		if (this.currentChar === '.') {
			result += this.currentChar;
			this.advance();

			while (this.currentChar !== null && isDigit(this.currentChar)) {
				result += this.currentChar;
				this.advance();
			}

			return getToken(TT.FLOAT_CONST, parseFloat(result));
		}

		return getToken(TT.INTEGER_CONST, parseInt(result));
	}
}
