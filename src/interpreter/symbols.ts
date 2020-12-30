class IvySymbol {
    constructor(public name: string, public type?: IvySymbol) { }
}

class BuiltInTypeSymbol extends IvySymbol {
    constructor(public name: string) {
        super(name);
    }
}

class VarSymbol extends IvySymbol {
    constructor(
        public name: string, 
        public type: BuiltInTypeSymbol) {
        super(name);
    }

    toString() {
        return `<${this.name}:${this.type}>`;
    }
}

