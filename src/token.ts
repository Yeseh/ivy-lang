export enum TT {
    INT = 'INT',
    FLOAT = 'FLOAT',
    PLUS = 'PLUS',
    MINUS = 'MINUS',
    MUL = 'MUL',
    DIV = 'DIV',
    LPAREN = 'LPAREN',
    RPAREN = 'RPAREN',
    EOF = 'EOF'
}

export class Token {
    type: TT;
    value?: any;

    constructor(type: TT, value: any = null) {
    	this.type = type;
    	this.value = value;
    }

    toString() {
    	return `[${this.type}] ${this.value}`;
    }
}

export const getToken = (type: TT, value?: any): Token => {
	return new Token(type, value);
};

