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
    	return this._symbols[name];
    }
}
