import { Parser } from './parser/parser';
import { Lexer } from './lexer';
import { Interpreter } from './interpreter/interpreter';

/** Entry point for the Ivy interpreter */
export const run = text => {
	const lex = new Lexer(text);
	const parser = new Parser(lex);

	const interpreter = new Interpreter(parser);

	interpreter.run();

	return interpreter.GLOBAL_SCOPE;
};

