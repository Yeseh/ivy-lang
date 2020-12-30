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
        public name: string, 
        public type: BuiltInTypeSymbol) {
        super(name);
    }

    toString() {
        return `<${this.name}:${this.type}>`;
    }
}

