export class IvySymbol {
	constructor(public name: string, public type?: IvySymbol) { }
}

export class BuiltInTypeSymbol extends IvySymbol {
	constructor(public name: string) {
		super(name);
	}
}

export class VarSymbol extends IvySymbol {
	constructor(
		name: string,
		type: BuiltInTypeSymbol,
        public mut: boolean = false
	) {
		super(name, type);
	}

	toString() {
		return `<${this.name}:${this.type}>`;
	}
}

export class FunctionSymbol extends IvySymbol {
	params: VarSymbol[];

	constructor(
		name: string,
        public returnType: BuiltInTypeSymbol,
	) {
		super(name, new BuiltInTypeSymbol('FUNCTION'));

	//	this.params = params ?? [];
	}
}

