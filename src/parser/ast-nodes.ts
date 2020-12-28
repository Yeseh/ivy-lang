import { Token } from '../token';

export abstract class AstNode {}

export const binaryOperator = (
    left: AstNode, 
    op: Token, 
    right: AstNode
) => new BinaryOperator(left, op, right,)

export const num = (token: Token): Num => new Num(token)

export class BinaryOperator extends AstNode {
   left: AstNode;
   op: Token;
   right: AstNode;
   token: Token;

    constructor(left: AstNode, op: Token, right: AstNode) {
        super();

        this.left = left;
        this.token = this.op = op;
        this.right = right;
    }
}

export class Num extends AstNode {
    token: Token;
    value: any;

    constructor(token: Token) {
        super();
        
        this.token = token;
        this.value = token.value;
    }
}
