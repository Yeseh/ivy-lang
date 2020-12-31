/* eslint-disable no-invalid-this */
import { ScopedSymbolTable } from './symbol-table';
import { Visitor } from './visitor';
import {
	Compound, IvyFile, BinaryOperator,
	UnaryOperator, Num,
	NoOperation, VarDecl, Assign, Variable,
	ProcedureDecl,
} from '../parser/ast-nodes';
import { VarSymbol } from './symbols';

export class SemanticAnalyzer extends Visitor {
    scope: ScopedSymbolTable

    constructor() {
    	super();

    	this.scope = new ScopedSymbolTable('global', 1);
    }

    // visitBlock = (node: Scope) => {
    // 	for (const decl of node.declarations) {
    // 		this.visit(decl);
    // 	}

    // 	this.visit(node.compound);
    // }

    visitFile = (node: IvyFile) => {
    	this.visit(node.compound);
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
    	this.scope.define(new VarSymbol(
    		node.variable.name,
    		this.scope.lookup(node.type.name),
    	));
    }

    visitProcedureDecl = (node: ProcedureDecl) => {
    	return;
    }

    visitAssign = (node: Assign) => {
    	if (!this.scope.lookup(node.left.name)) {
    		throw new Error(`Assignment to undeclared variable ${node.left.name}`);
    	}

    	this.visit(node.right);
    }

    visitVariable = (node: Variable) => {
    	if (!this.scope.lookup(node.name)) {
	 		throw new Error(`Usage of undeclared variable ${node.name}`);
    	}
    }
}
