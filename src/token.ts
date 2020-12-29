export enum TT {
    INT,
    FLOAT,
    PLUS, 
    MINUS,
    MUL, 
    DIV, 
    LPAREN,
    RPAREN,
    LBRACE,
    RBRACE,
    ID,
    SEMI,
    I_ASSIGN,
    MUT,
    FUNC,
    LF,
    EOF,
    BEGIN,
    END,
    DOT
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

