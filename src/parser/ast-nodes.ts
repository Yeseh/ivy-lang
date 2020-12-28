import { Token } from '../token';

export abstract class AstNode {
    token: Token;

    constructor(token: Token) {
        this.token = token;
    }
}

export const binaryOperator = (
    left: AstNode, 
    op: Token, 
    right: AstNode
) => new BinaryOperator(left, op, right,)

export const num = (token: Token): Num => new Num(token)
export const unaryOperator = (token: Token, expr: AstNode): UnaryOperator => new UnaryOperator(token, expr);

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
        super(token)

        this.expr = expr;
        this.op = token;
    }
}