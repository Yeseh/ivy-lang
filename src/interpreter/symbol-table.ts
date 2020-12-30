/* eslint-disable no-invalid-this */
import { Assign, BinaryOperator, Block, Compound, ExprNode, NoOperation, Num, Program, UnaryOperator, VarDecl, Variable } from 'src/parser/ast-nodes';
import { BuiltInTypeSymbol, IvySymbol, VarSymbol } from './symbols';
import { Visitor } from './visitor';

export interface SymbolMap {
    [key: string]: IvySymbol;
}

export class SymbolTable {
    _symbols: SymbolMap;

    constructor() {
        this._symbols = {};
        this.init();
    }

    init = () => {
        this.define(new BuiltInTypeSymbol('INT'));
        this.define(new BuiltInTypeSymbol('FLOAT'));
        this.define(new BuiltInTypeSymbol('STRING'));
    }

    define = (sym: IvySymbol) => {
        this._symbols[sym.name] = sym;
    }

    lookup = (name: string) => {
        return this._symbols[name];
    }
}

export class SymbolTableBuilder extends Visitor {
    symtab: SymbolTable

    constructor() {
        super();

        this.symtab = new SymbolTable();
    }

    visitBlock = (node: Block) => {
       for(const decl of node.declarations) {
           this.visit(decl);
       }

       this.visit(node.compound);
    }

    visitProgram = (node: Program) => {
        this.visit(node.block);
    }

    visitBinaryOperator = (node: BinaryOperator) => {
        this.visit(node.left);
        this.visit(node.right);
    }

    visitNum = (node: Num) => {
        return;
    }

    visitUnaryOperator = (node: UnaryOperator) => {
        this.visit(node.expr);
    }

    visitCompound = (node: Compound) => {
        for (const c of node.children) {
            this.visit(c);
        }
    }

    visitNoOperation = (node: NoOperation) => {
        return;
    }

    visitVarDecl = (node: VarDecl) => {
       this.symtab.define(new VarSymbol(
           node.variable.name,
           this.symtab.lookup(node.type.name),
       ))
    }

    visitAssign = (node: Assign) => {
       if (!this.symtab.lookup(node.left.name)) {
           throw new Error(`Assignment to undeclared variable ${node.left.name}`);
       }

       this.visit(node.right);
    }

    visitVariable = (node: Variable) => {
       if (!this.symtab.lookup(node.name)) {
           throw new Error(`Usage of undeclared variable ${node.name}`)
       }
    }
}