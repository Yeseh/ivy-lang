export enum TT {
    // Typing
    COLON = 'COLON', // Separator for type definition -> remove later
    INT = 'INT',
    FLOAT = 'FLOAT',
    STRING = 'STRING',
    VOID = 'VOID',
    ARRAY = 'ARRAY',
    OBJECT = 'OBJECT',
    FUNCTION = 'FUNCTION',

    // Operators
    PLUS = 'PLUS',
    MINUS = 'MINUS',
    MUL = 'MUL',
    DIV = 'DIV',

    // Blocks
    COMMA = 'COMMA',
    LPAREN = 'LPAREN',
    RPAREN = 'RPAREN',
    LBRACE = 'LBRACE',
    RBRACE = 'RBRACE',
    LBRACKET = 'LBRACKET',
    RBRACKET = 'RBRACKET',
    DOT = 'DOT',
    SEMI = 'SEMI',

    // Variables
    ID = 'ID',
    R_ASSIGN = 'R_ASSIGN', // re-assign, overwrite mutable value =
    I_ASSIGN = 'I_ASSIGN', // Initialize and assign immutable variable :=
    M_ASSIGN = 'M_ASSIGN', // Initialize and assign mutable variable ?=

    // Functions
    PROCEDURE = 'PROCEDURE',
    F_ASSIGN = 'F_ASSIGN', // Function assignment ::
    LAMBDA = 'LAMBDA', // Fat arrow function shorthand =>

    // Control
    IF = 'IF',
    ELIF = 'ELIF',
    ELSE = 'ELSE',

    // Whitespace
    LF = 'LF',
    EOF = 'EOF',
    SPACE = 'SPACE',
    TAB = 'TAB',
    VAR = 'VAR',

    // Value types
    INTEGER_CONST = 'INTEGER_CONST',
    FLOAT_CONST = 'FLOAT_CONST',
    STRING_CONST = 'STRING_CONST',
    ARRAY_CONST = 'ARRAY_CONST',
    OBJECT_CONST = 'OBJECT_CONST',

    // Meta
    L_COMMENT = 'LCOMMENT',
    B_COMMENT = 'BCOMMENT',
    POUND = 'POUND' // # for annotations?
}

export const builtInTypes = [TT.INT, TT.FLOAT, TT.STRING, TT.FUNCTION];
export const assignmentOps = [TT.I_ASSIGN, TT.M_ASSIGN, TT.R_ASSIGN];

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

