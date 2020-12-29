import { Visitor } from './visitor';
import { Parser } from '../parser/parser';
import { BinaryOperator, Compound, Num, UnaryOperator, Assign, Variable } from '../parser/ast-nodes';
import { TT } from '../token';

interface SymbolTable {
    [k: string]: any
}
export class Interpreter extends Visitor {
    parser: Parser;
    GLOBAL_SCOPE: SymbolTable;

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

    visitCompound(node: Compound) {
        for (const child of node.children) {
            this.visit(child);
        }
    }

    visitAssign(node: Assign) {
        const name = node.left.name;
        this.GLOBAL_SCOPE[name] = this.visit(node.right);
    }

    visitVar(node: Variable) {
       const name = node.name;
       const value = this.GLOBAL_SCOPE[name];

       if (!value) {
           // TODO: Better error
           throw new Error(`Unidentified symbol ${name}`)
       }

       return value;
    }

    visitNoOperation() {
        return;
    }
}