/* eslint-disable no-invalid-this */
import { ScopedSymbolTable } from './symbol-table';
import { Visitor } from './visitor';
import {
	Compound, IvyFile, BinaryOperator,
	UnaryOperator, Num,
	NoOperation, VarDecl, Assign, Variable,
	FunctionDecl,
} from '../parser/ast-nodes';
import { FunctionSymbol, VarSymbol } from './symbols';

export class SemanticAnalyzer extends Visitor {
    currentScope: ScopedSymbolTable

    constructor() {
    	super();

    	this.currentScope = null;
    }

    // visitBlock = (node: Scope) => {
    // 	for (const decl of node.declarations) {
    // 		this.visit(decl);
    // 	}

    // 	this.visit(node.compound);
    // }

    visitIvyFile = (node: IvyFile) => {
    	console.log('ENTER SCOPE: file');

    	this.currentScope = new ScopedSymbolTable('file', 1, null);

    	this.visit(node.compound);
    	console.log(this.currentScope);

    	console.log('LEAVE SCOPE: file');
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
    	const type = this.currentScope.lookup(node.type.name);

    	node.variable.forEach(v => {
    		this.currentScope.define(new VarSymbol(
    		    v.name,
    		    type,
    	    ));
    	});
    }

    visitFunctionDecl = (node: FunctionDecl) => {
    	console.log('ENTER PROCEDURE SCOPE: ' + node.name);
    	this.currentScope.define(new FunctionSymbol(node.name, node.returnType));

    	const funcScope = new ScopedSymbolTable(
    		node.name,
    		this.currentScope.scopeLvl + 1,
    		this.currentScope
    	);

    	this.currentScope = funcScope;

    	for (const p of node.params) {
    		const type = this.currentScope.lookup(p.type.name);

    		if (!type) {
    			throw new Error(`Usage of undeclared type '${p.type.name}`);
    		}

    		this.currentScope.define(new VarSymbol(
    			p.variable.name,
    			type
    		));
    	}

    	this.visit(node.compound);

    	this.currentScope = this.currentScope.enclosingScope;
    	console.log('LEAVE PROCEDURE SCOPE: ' + node.name);
    }

    visitAssign = (node: Assign) => {
    	if (!this.currentScope.lookup(node.left.name)) {
    		throw new Error(`Assignment to undeclared variable ${node.left.name}`);
    	}

    	this.visit(node.right);
    }

    visitVariable = (node: Variable) => {
    	if (!this.currentScope.lookup(node.name)) {
	 		throw new Error(`Usage of undeclared variable ${node.name}`);
    	}
    }
}
