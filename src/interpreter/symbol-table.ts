/* eslint-disable no-invalid-this */
import { BuiltInTypeSymbol, IvySymbol } from './symbols';

const builtInTypes = ['INT', 'FLOAT', 'STRING', 'FUNCTION'];
export interface SymbolMap {
    [key: string]: IvySymbol;
}

export class ScopedSymbolTable {
    _symbols: SymbolMap;

    constructor(
       public scopeName: string,
       public scopeLvl: number,
       public enclosingScope: ScopedSymbolTable
    ) {
    	this._symbols = {};
    	this.init();
    }

    init = () => {
    	builtInTypes.forEach(t => this.define(new BuiltInTypeSymbol(t)));
    }

    define = (sym: IvySymbol) => {
    	this._symbols[sym.name] = sym;
    }

    lookup = (name: string) => {
    	const lookup = this._symbols[name];

    	if (lookup) {
    		return lookup;
    	};

    	if (this.enclosingScope !== null) {
    		return this.enclosingScope.lookup(name);
    	}
    }
}
