import { Visitor } from './visitor';
import { Parser } from '../parser/parser';
import { BinaryOperator, Num, UnaryOperator } from '../parser/ast-nodes';
import { TT } from '../token';

export class Interpreter extends Visitor {
    parser: Parser;

    constructor(parser: Parser) {
        super()

        this.parser = parser;
    }

    run = () => {
        const tree = this.parser.parse();
        return this.visit(tree);
    }

    visitNum = (node: Num) => {
        return node.value;
    }

    visitBinaryOperator = (node: BinaryOperator) => {
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

    visitUnaryOperator = (node: UnaryOperator) => {
        switch(node.op.type) {
            case TT.PLUS:
                return +this.visit(node.expr)
            case TT.MINUS:
                return -this.visit(node.expr)
        }
    }
}