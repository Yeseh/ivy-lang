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
	currentToken: null
}

const isDigit = (char: string) => DIGITS.includes(char);

export const lex = (text: string) => {
	lexer.text = text;
	return expr();
}

const getNextToken = (): Token | IvyError => {
 	if (lexer.pos > lexer.text.length - 1) {
		return getToken(TT.EOF, null)
	}

	const currentChar = lexer.text[lexer.pos];

	const token = createToken(currentChar);

	if (token instanceof IvyError) {
		throw token;
	}

	return token;
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

	console.log(lexer.currentToken);

	const left = lexer.currentToken;
	eat(TT.INT);

	const op = lexer.currentToken;
	eat(TT.PLUS);

	const right = lexer.currentToken;
	eat(TT.INT);

	return left.value + right.value;
}

const createToken = (char: string): Token | IvyError => {
	console.log(`making token of char: ${char}`);
	let error: IvyError = null;
	let token: Token = null;

	if (WHITESPACE.includes(char)) {
		getNextToken();
	}
	else if (isDigit(char)) {
		token = getToken(TT.INT, parseInt(char))
	}
	else if (char === '+') {
		token = getToken(TT.PLUS)
	}
	else if (char === '-') {
		token = getToken(TT.MINUS)
	}
	else if (char === '/') {
		token = getToken(TT.DIV)
	}
	else if (char === '*') {
		token = getToken(TT.MUL)
	}
	else if (char === '(') {
		token = getToken(TT.LPAREN)
	}
	else if (char === ')') {
		token = getToken(TT.RPAREN)
	}
	else if (char === null) {
		token = getToken(TT.EOF)
	}
	else {
		return lexingError();	
	}

	lexer.pos++;

	return token;
}