import { lex } from './lexer';

export const run = text => {
	return lex(text);
};

