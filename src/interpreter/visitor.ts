import { AstNode } from '../parser/ast-nodes';

export class Visitor {
	constructor() {
		this.visit = this.visit.bind(this);
	}

	visit(node: AstNode) {
		const fnName = 'visit' + node.constructor.name;
		const visitor = this[fnName];

		if (typeof visitor !== 'function') {
		    throw Error(`No visit method available for node ${node.constructor.name}`);
		}

		return visitor(node);
	}
}
