import { Lexer } from '../lexer';
import { Token, TT } from '../token';
import {
	AstNode, binaryOperator, num,
	unaryOperator, compound,
	assign, variable, NoOperation, Statement,
	Block, block, VarDecl, varDecl, typeNode,
	program,
} from './ast-nodes';
export class Parser {
    lex: Lexer;
    currentToken: Token
	errors: Error[];

	constructor(lex: Lexer) {
    	this.lex = lex;
    	this.currentToken = lex.getNextToken();
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
    	const node = this.program();

    	if (this.currentToken.type !== TT.EOF) {
    		return this.expr();
    	}

    	return node;
	}

	// TODO: Instead of throwing error, return the error
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
			this.eat(TT.FLOAT_CONST)
			[]
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

	program() {
		this.eat(TT.PROGRAM);

		const varNode = this.variable();
		const progName = varNode.name;

		this.eat(TT.SEMI);

		const blockNode = this.block();
		const progNode = program(progName, blockNode);

		this.eat(TT.DOT);

    	return progNode;
	}

	block() {
    	return block(this.declarations(), this.compoundStatement());
	}

	declarations() {
    	let declarations = [];

    	// Look for VAR keyword
    	if (this.currentToken.type === TT.VAR) {
    		this.eat(TT.VAR);
    		// eslint-disable-next-line
    		// @ts-ignore
    		while (this.currentToken.type === TT.ID) { // Look for ID
    			const vars = this.variableDeclaration();
    			declarations = [...declarations, ...vars];

    			// TODO: replace with LF
    			// Look for semi to end declaration
    			this.eat(TT.SEMI);
    		}
    	}

    	return declarations;
	}
	/*

	function_declaration: ID F_ASSIGN function_parameters compound_statement
	function_parameters: (variable_declaration COMMA)*
	variable_declaration: (int | float | string) ID

	(int x, string y)

	functionDeclaration() {
		const var = this.variable()
		const token = this.currentToken

		this.eat(F_ASSIGN) // eat ::
		const paramList = this.functionParameters();

		return functionDeclaration(left, paramList, compound_statement);
	}

	functionParameters() {
		this.eat(LPAREN)
		let params = [];

		if (this.currentToken === TYPE) {
			params = [...params, ]
			params.push(this.variableDeclaration())


			while (this.currentToken === )
		}

		this.eat(RPAREN);

		return params;
	}
	*/

	// TODO: rewrite to (int | float | string) ID
	variableDeclaration() {
    	const vars = [variable(this.currentToken)];

    	this.eat(TT.ID);

    	// int test := 1;
    	// int test1 ?= 2;:w

    	// While there are comma separated var declarations
    	while (this.currentToken.type === TT.COMMA) {
    		this.eat(TT.COMMA);
    		vars.push(variable(this.currentToken));
    		this.eat(TT.ID);
    	}

    	// TODO: if eating colon fails, attempt to infer type from variable
    	this.eat(TT.COLON);

    	const typen = this.typeSpec();

    	const decls = vars.map(v => varDecl(v, typen));

    	return decls;
	}

	typeSpec() {
    	const token = this.currentToken;

    	switch (this.currentToken.type) {
    		case TT.INT:
    			this.eat(TT.INT);
    			break;
    		case TT.FLOAT:
    			this.eat(TT.FLOAT);
    			break;
    		case TT.STRING:
    			this.eat(TT.STRING);
    	}

    	return typeNode(token);
	}

	// TODO: rewrite to LBRACE statement_list RBRACE
	compoundStatement() {
    	this.eat(TT.BEGIN);
    	const nodes: Statement[] = this.statementList();
    	this.eat(TT.END);

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
    		this.eat(TT.SEMI);
    		results.push(this.statement());
    	}

    	return results;
	}

	statement() {
    	let node;

    	if (this.currentToken.type === TT.BEGIN) {
    		node = this.compoundStatement();
    	}
    	else if (this.currentToken.type === TT.ID) {
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

		// Switch assignment types;
    	this.eat(TT.I_ASSIGN);

    	const right = this.expr();

    	const node = assign(left, token, right);

    	return node;
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
