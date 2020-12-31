import { Lexer } from '../lexer';
import {
	Token, TT, builtInTypes, assignmentOps,
} from '../token';
import {
	AstNode, binaryOperator, num,
	unaryOperator, compound,
	assign, variable, NoOperation, Statement,
	Compound, VarDecl, varDecl, typeNode,
	file, Param, Type,
	functionDecl,
	Variable,
} from './ast-nodes';
export class Parser {
    lex: Lexer;
    currentToken: Token
	errors: Error[];

	constructor(lex: Lexer) {
    	this.lex = lex;
		this.currentToken = lex.getNextToken();
		this.errors = [];
	}

	error(info?: string) {
    	let err = `Invalid syntax at ${this.lex.line}:${this.lex.char}. `;

    	if (info) {
    		err += info;
    	};

		this.errors.push(new Error(err));
    	throw new Error(err);
	}

	parse() {
    	const node = this.file();

    	// if (this.currentToken.type !== TT.EOF) {
    	// 	return this.expr();
    	// }

    	return node;
	}

	// TODO: Instead of throwing error, return the error
	// TODO: Recognize invalid type names instead of standard error
	eat(type: TT | TT[]) {
		console.log(this.currentToken);
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

    	if (token.type === TT.PLUS) {
    		this.eat(TT.PLUS);
    		return unaryOperator(token, this.factor());
    	}
    	if (token.type === TT.MINUS) {
    		this.eat(TT.MINUS);
    		return unaryOperator(token, this.factor());
    	}
    	else if (token.type === TT.INTEGER_CONST) {
    		this.eat(TT.INTEGER_CONST);
    		return num(token);
    	}
		else if (token.type === TT.FLOAT_CONST) {
			this.eat(TT.FLOAT_CONST);
			return num(token);
		}
    	else if (token.type === TT.LPAREN) {
    		this.eat(TT.LPAREN);
    		const node = this.expr();
    		this.eat(TT.RPAREN);

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
    	const ops = [TT.DIV, TT.MUL];
    	let node = this.factor();

    	while (ops.includes(this.currentToken.type)) {
    		const token = this.currentToken;

    		this.currentToken.type === TT.MUL
    			? this.eat(TT.MUL)
    			: this.eat(TT.DIV);

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
    	const ops = [TT.PLUS, TT.MINUS, TT.DIV, TT.MUL];
    	let node = this.term();

    	while (ops.includes(this.currentToken.type)) {
    		const token = this.currentToken;

    		this.currentToken.type === TT.PLUS
    			? this.eat(TT.PLUS)
    			: this.eat(TT.MINUS);

    		node = binaryOperator(node, token, this.term());
    	}

    	return node;
	}

	file() {
		// File should create a scope for itself
		// Imports add to the file scope
		return file('main.ivy', this.compound('file'));
	}

	// TODO: Rename to proper grammar
	compound(name: string) {
		const nodes: Statement[] = this.statementList();

		const root = compound(name);

    	for (const node of nodes) {
    		root.children.push(node);
    	}

    	return root;
	}

	statementList() {
    	const node = this.statement();

    	const results = [node];

    	while (this.currentToken.type === TT.SEMI) {
    		this.eat(TT.SEMI);
    		results.push(this.statement());
    	}

    	return results;
	}

	statement() {
    	let node;
		// TODO: Allow anonymous block scopes??
    	// if (this.currentToken.type === TT.LBRACE) {
    	// 	node = this.blockCompound();
		// }
		const typenode = this.typeSpec();
		// IF !typenode -> R_ASSIGN | function_call
		const peek = this.lex.peekChars(3).trim();

		console.log({
			peek,
		});

		if (typenode && peek === '::') {
			node = this.functionDeclaration(typenode);
		}
		// TODO: Inline assignment en type-declaratie
		else if (!typenode && (peek === ':=' || peek === '?=')) {
			// TODO: Semantic error als er geen typenode is maar wel I/M assignment
			node = this.assignmentStatement(typenode);
		}
		/* else if FUNCTION_CALL */
		else if (typenode) {
		 	node = this.variableDeclaration(typenode);
		}
    	else {
    		node = this.empty();
    	}

    	return node;
	}
	// Variable declaration: (type)? ID (COMMA | assignment) SEMI
	// Assignment: (DECLARATION | variable) (I_ASSIGN | M_ASSIGN | R_ASSIGN)
	//
	variableDeclaration(type: Type) {
		const left = variable(this.currentToken);
		const vars = [left];
		this.eat(TT.ID);

		// While there are comma separated var declarations
		while (this.currentToken.type === TT.COMMA) {
			this.eat(TT.COMMA);
			vars.push(variable(this.currentToken));
			this.eat(TT.ID);
		}

		return varDecl(vars, type);
	}

	functionDeclaration(returnType: Type) {
		const fnName = this.currentToken.value;
		this.eat(TT.ID);
		this.eat(TT.F_ASSIGN);

		let params: Param[];

		if (this.currentToken.type === TT.LPAREN) {
			this.eat(TT.LPAREN);
			params = this.parameterList();
			this.eat(TT.RPAREN);
		}

		this.eat(TT.LBRACE);
		const comp = this.compound(fnName);
		this.eat(TT.RBRACE);

		return functionDecl(fnName, returnType, params, comp);
	}

	assignmentStatement(type: Type) {
		let mut = false;

		const token = this.currentToken;
		const left = variable(this.currentToken);

		this.eat(TT.ID);
		// Switch assignment types;
		if (this.currentToken.type === TT.I_ASSIGN) {
			this.eat(TT.I_ASSIGN);
		}
		else if (this.currentToken.type === TT.M_ASSIGN) {
			this.eat(TT.M_ASSIGN);
			mut = true;
		}

		const right = this.expr();

		return assign(left, token, right);
	}

	parameterList() {
		const paramList = [this.parameter()];

		while (this.currentToken.type === TT.COMMA) {
			this.eat(TT.COMMA);
			paramList.push(this.parameter());
		}

		return paramList;
	}

	parameter() {
		// see and eat type: int param, float param2
		const typeNode = this.typeSpec();

		const variable = new Variable(this.currentToken);
		this.eat(TT.ID);

		return new Param(variable, typeNode);
	}


	typeSpec() {
		const token = this.currentToken;
		// TODO: this is the place to check existing custom types
		const type: TT = [TT.INT, TT.FLOAT, TT.STRING, TT.VOID]
			.find(t => t === token.type);

		if (type) {
			this.eat(type);
    		return typeNode(token, token.type);
		}

		return null;
	}

	variable() {
    	const node = variable(this.currentToken);

    	this.eat(TT.ID);

    	return node;
	}

	empty() {
    	return new NoOperation();
	}
}
