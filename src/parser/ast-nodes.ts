import { Token } from '../token';

export type ExprNode = Num | BinaryOperator | UnaryOperator | AstNode;

export abstract class AstNode {
    token: Token;

    constructor(token?: Token) {
    	this.token = token ?? null;
    }
}
export class BinaryOperator extends AstNode {
   left: AstNode;
   op: Token;
   right: AstNode;

   constructor(left: AstNode, op: Token, right: AstNode) {
   	super(op);

   	this.left = left;
   	this.op = op;
   	this.right = right;
   }
}

export class Num extends AstNode {
    value: any;

    constructor(token: Token) {
    	super(token);

    	this.value = token.value;
    }
}

export class UnaryOperator extends AstNode {
    token: Token;
    op: Token;
    expr: AstNode;

    constructor(token: Token, expr: AstNode) {
    	super(token);

    	this.expr = expr;
    	this.op = token;
    }
}
export class Statement extends AstNode {}
export class Compound extends AstNode {
    children: Statement[];

    constructor() {
    	super();

    	this.children = [];
    }
}

export class Assign extends AstNode {
    left: Variable;
    op: Token;
    right: ExprNode;

    constructor(left: Variable, op: Token, right: ExprNode) {
    	super(op);

    	this.left = left;
    	this.op = op;
    	this.right = right;
    }
}

export class Variable extends AstNode {
    name: string

    constructor(token: Token) {
    	super(token);

    	this.name = token.value;
    }
}

export class NoOperation extends AstNode {}

export class Block extends AstNode {
	constructor(public declarations: AstNode[], public compound: Compound) {
		super();
	}
}
export class Program extends AstNode {
	constructor(public name: string, public block: Block) {
    	super();
	}
}

export class VarDecl extends AstNode {
	constructor(public variable: Variable, public type: Type) {
		super();
	}
}

export class Type extends AstNode {
	constructor(token: Token) {
		super(token);
	}
}


/* eslint-disable */
export const binaryOperator = (left: ExprNode, op: Token, right: ExprNode) => new BinaryOperator(left, op, right,);
export const num = (token: Token) => new Num(token);
export const unaryOperator = (token: Token, expr: ExprNode) => new UnaryOperator(token, expr);
export const variable = (token: Token) => new Variable(token);
export const assign = (left: Variable, op: Token, right: ExprNode) => new Assign(left, op, right);
export const compound = () => new Compound();
export const typeNode = (token: Token) => new Type(token);
export const program = (name: string, block: Block) => new Program(name, block);
export const varDecl = (variable: Variable, type: Type) => new VarDecl(variable, type);
export const block = (declarations: AstNode[], compound: Compound) => new Block(declarations, compound);