import { Interpreter } from './Interpreter';
import { Lexer } from './Lexer';

export const run = text => {
	const lex = new Lexer(text);
	const interpreter = new Interpreter(lex);

	return interpreter.expr();
};

