import { Lexer } from '../lexer';
import { Token, TT } from '../token';
import {
	AstNode, binaryOperator, num,
	unaryOperator, compound,
	assign, variable, NoOperation, Statement,
} from './ast-nodes';

const {
	EOF, INT, LPAREN, PLUS,
	MINUS, DIV, MUL, RPAREN,
	BEGIN, END, SEMI, ID, I_ASSIGN, DOT,
} = TT;

export class Parser {
    lex: Lexer;
    currentToken: Token

    constructor(lex: Lexer) {
    	this.lex = lex;
    	this.currentToken = lex.getNextToken();
    }

    error(info?: string) {
    	let err = `Invalid syntax at ${this.lex.line}:${this.lex.char}. `;

    	if (info) {
    		err += info;
    	};

    	throw new Error(err);
    }

    parse() {
    	const node = this.program();

    	if (this.currentToken.type !== EOF) {
    		return this.expr();
    	}

    	return node;
    }

    eat(type: TT | TT[]) {
    	if (
    		this.currentToken.type === type ||
            (Array.isArray(type) && type.includes(this.currentToken.type))
    	) {
    		this.currentToken = this.lex.getNextToken();
    	}
    	else {
    		this.error('Expected token ' + type);
    	}
    }
    /**
     * factor: (PLUS|MINUS) factor | INTEGER | LPAREN expr RPAREN
     */
    factor(): AstNode {
    	const token = this.currentToken;

    	if (token.type === PLUS) {
    		this.eat(PLUS);
    		return unaryOperator(token, this.factor());
    	}
    	if (token.type === MINUS) {
    		this.eat(MINUS);
    		return unaryOperator(token, this.factor());
    	}
    	else if (token.type === INT) {
    		this.eat(INT);
    		return num(token);
    	}
    	else if (token.type === LPAREN) {
    		this.eat(LPAREN);
    		const node = this.expr();
    		this.eat(RPAREN);

    		return node;
    	}
    	else {
    		return this.variable();
    	}
    }
    /**
     * term: factor ((MUL | DIV) factor) *
     */
    term(): AstNode {
    	const ops = [DIV, MUL];
    	let node = this.factor();

    	while (ops.includes(this.currentToken.type)) {
    		const token = this.currentToken;

    		this.currentToken.type === TT.MUL
    			? this.eat(MUL)
    			: this.eat(DIV);

    		node = binaryOperator(node, token, this.factor());
    	}

    	return node;
    }

    /**
     * expr: term ((PLUS | MINUS) term) *
     *
     * term: factor ((MUL | DIV) factor) *
     *
     * factor: INTEGER
     */
    expr(): AstNode {
    	const ops = [PLUS, MINUS, DIV, MUL];
    	let node = this.term();

    	while (ops.includes(this.currentToken.type)) {
    		const token = this.currentToken;

    		this.currentToken.type === PLUS
    			? this.eat(PLUS)
    			: this.eat(MINUS);

    		node = binaryOperator(node, token, this.term());
    	}

    	return node;
    }

    program() {
    	const node = this.compoundStatement();
    	this.eat(DOT);

    	return node;
    }

    compoundStatement() {
    	this.eat(BEGIN);
    	const nodes: Statement[] = this.statementList();
    	this.eat(END);

    	const root = compound();

    	for (const node of nodes) {
    		root.children.push(node);
    	}

    	return root;
    }

    statementList() {
    	const node = this.statement();

    	const results = [node];

    	while (this.currentToken.type === TT.SEMI) {
    		this.eat(SEMI);
    		results.push(this.statement());
    	}

    	return results;
    }

    statement() {
    	let node;

    	if (this.currentToken.type === BEGIN) {
    		node = this.compoundStatement();
    	}
    	else if (this.currentToken.type === ID) {
    		node = this.assignmentStatement();
    	}
    	// TODO: function assignment
    	else {
    		node = this.empty();
    	}

    	return node;
    }

    assignmentStatement() {
    	const left = this.variable();
    	const token = this.currentToken;

    	this.eat(I_ASSIGN);

    	const right = this.expr();

    	const node = assign(left, token, right);

    	return node;
    }

    variable() {
    	const node = variable(this.currentToken);

    	this.eat(ID);

    	return node;
    }

    empty() {
    	return new NoOperation();
    }
}
