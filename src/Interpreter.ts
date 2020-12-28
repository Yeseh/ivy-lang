import { Lexer } from './Lexer';
import { Token, TT} from './Token';

const {INT, LPAREN, PLUS, MINUS, DIV, MUL, RPAREN} = TT; 

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
    /**
     * factor: INTEGER | LPAREN expr RPAREN
     */
    factor() {
        const token = this.currentToken;

        if (token.type === INT) {
            this.eat(INT);
            return token.value; 
        }
        else if (token.type === LPAREN) {
            this.eat(LPAREN);
            let result = this.expr();
            this.eat(RPAREN);
            return result;
        }
    }
    /**
     * term: factor ((MUL | DIV) factor) * 
     */
    term() {
        const ops = [DIV, MUL];
        let result = this.factor();

        while (ops.includes(this.currentToken.type)) {
            switch (this.currentToken.type) {
                case MUL:
                    this.eat(MUL);
                    result *= this.factor();
                    break;
                case DIV:
                    this.eat(DIV);
                    result /= this.factor();
                    break;
            }
        }

        return result;
    }

    /**
     * expr: term ((PLUS | MINUS) term) *
     * 
     * term: factor ((MUL | DIV) factor) *
     * 
     * factor: INTEGER
     */
    expr() {
        const ops = [PLUS, MINUS, DIV, MUL];
        let result = this.term();

        while (ops.includes(this.currentToken.type)) {
            switch (this.currentToken.type) {
                case PLUS:
                    this.eat(PLUS)
                    result += this.term();
                    break;
                case MINUS:
                    this.eat(MINUS)
                    result -= this.term();
                    break;
            }
        }

        return result;
    }
}