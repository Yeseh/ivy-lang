import { Visitor } from './visitor';
import { Parser } from '../parser/parser';
import { BinaryOperator, Num } from '../parser/ast-nodes';
import { TT } from '../token';

export class Interpreter extends Visitor {
    parser: Parser;

    constructor(parser: Parser) {
        super()

        this.parser = parser;

        this.run = this.run.bind(this);
        this.visitBinaryOperator = this.visitBinaryOperator.bind(this);
        this.visitNum = this.visitNum.bind(this);
    }

    run() {
        const tree = this.parser.parse();
        return this.visit(tree);
    }

    visitBinaryOperator(node: BinaryOperator) {
        switch (node.op.type) {
            case TT.PLUS:
                return this.visit(node.left) + this.visit(node.right);
            case TT.MINUS:
                return this.visit(node.left) - this.visit(node.right);
            case TT.DIV:
                return this.visit(node.left) / this.visit(node.right);
            case TT.MUL:
                return this.visit(node.left) * this.visit(node.right);
        }
    }
    
    visitNum(node: Num) {
        return node.value;
    }
}