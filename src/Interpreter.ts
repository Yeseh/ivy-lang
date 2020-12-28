import { Lexer } from './Lexer';
import { Token, TT } from './Token';

export class Interpreter {
    lex: Lexer;
    currentToken: Token

    constructor(lex: Lexer) {
        this.lex = lex;
        this.currentToken = lex.getNextToken();
    }    

    error() {
        throw new Error("Invalid syntax")
    }

    eat(type: TT | TT[]) {
        if (
            this.currentToken.type === type ||		
            (Array.isArray(type) && type.includes(this.currentToken.type))
        ) {			
            this.currentToken = this.lex.getNextToken();
        }
        else {
            this.error();
        }
    }

    factor() {
        const value = this.currentToken.value;
        this.eat(TT.INT)

        return parseInt(value);
    }

    expr() {
        const ops = [TT.PLUS, TT.MINUS, TT.DIV, TT.MUL];
        let result = this.factor();

        while (ops.includes(this.currentToken.type)) {
            switch (this.currentToken.type) {
                case TT.PLUS:
                    this.eat(TT.PLUS)
                    result += this.factor();
                    break;
                case TT.MINUS:
                    this.eat(TT.MINUS)
                    result += this.factor();
                    break;
                case TT.MUL:
                    this.eat(TT.MUL);
                    result *= this.factor();
                    break;
                case TT.DIV:
                    this.eat(TT.DIV);
                    result /= this.factor();
                    break;
            }
        }

        return result;
    }
}