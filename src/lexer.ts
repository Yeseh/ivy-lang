import {
	getToken, TT, Token,
} from './Token';
import { LexingError, IvyError } from './errors';

const WHITESPACE = ['\t', ' ', '\n'];
const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const DIGIT_SEPARATORS = ['.', ','];

const lexer = {
	text: "",
	line: 0,
	pos: 0,
	currentToken: null,
	currentChar: ""
}

const isDigit = (char: string) => DIGITS.includes(char);
const isSpace = (char: string) => WHITESPACE.includes(char); 

export const lex = (text: string) => {
	lexer.text = text;
	lexer.pos = 0;
	lexer.line = 0;
	lexer.currentChar = text[lexer.pos];

	return expr();
}

const advance = () => {
	lexer.pos++;

	if (lexer.pos > lexer.text.length -1) {
		lexer.currentChar = null;
	}
	else {
		lexer.currentChar = lexer.text[lexer.pos];
	}
}

const skipWhitespace = () => {
	while (lexer.currentChar !== null && isSpace(lexer.currentChar)) {
		advance();
	}
}

const makeInteger = () => {
	let numStr = '';

	while (lexer.currentChar !== null && isDigit(lexer.currentChar)) {
		numStr += lexer.currentChar;
		advance();
	}
	
	return parseInt(numStr);
}

const getNextToken = (): Token | IvyError => {
	while (lexer.currentChar !== null) {
		const char = lexer.currentChar;

		if (isSpace(lexer.currentChar)) {
			skipWhitespace();
			continue;
		}
		
		if (isDigit(lexer.currentChar)) {
			return getToken(TT.INT, makeInteger());
		}
		
		if (char === '+') {
			advance();
			return getToken(TT.PLUS)
		}
		
		if (char === '-') {
			advance();
			return getToken(TT.MINUS)
		}

		if (char === '/') {
			advance()
			return getToken(TT.DIV)
		}
		
		if (char === '*') {
			advance()
			return getToken(TT.MUL)
		}
		
		if (char === '(') {
			advance()
			return getToken(TT.LPAREN)
		}
		
		if (char === ')') {
			advance()
			return getToken(TT.RPAREN)
		}
			
		return lexingError();	
	}

	return getToken(TT.EOF, null);
}

const lexingError = () => { 
	return new LexingError('Error parsing input at position ' + lexer.pos)
}

const eat = (type: TT | TT[]) => {
	if (
		(Array.isArray(type) && type.includes(lexer.currentToken.type))
		|| lexer.currentToken.type === type
	) {			
		lexer.currentToken = getNextToken();
	}
	else {
		lexingError();
	}
}

const expr = (): Number => {
	lexer.currentToken = getNextToken();

	const left = lexer.currentToken;
	eat(TT.INT);

	const op = lexer.currentToken;
	op.type === TT.PLUS ? eat(TT.PLUS) : eat(TT.MINUS);

	const right = lexer.currentToken;
	eat(TT.INT);

	return op.type === TT.PLUS 
		? left.value + right.value
		: left.value - right.value
}