import { Lexer } from '../lexer';
import { Token, TT} from '../token';
import { AstNode, binaryOperator, num, unaryOperator} from './ast-nodes'

const {INT, LPAREN, PLUS, MINUS, DIV, MUL, RPAREN} = TT; 

export class Parser {
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
     * factor: (PLUS|MINUS) factor | INTEGER | LPAREN expr RPAREN
     */
    factor(): AstNode {
        const token = this.currentToken;

        if (token.type === PLUS) {
            this.eat(PLUS);
            return unaryOperator(token, this.factor());
        }
        if (token.type === MINUS) {
            this.eat(MINUS);
            return unaryOperator(token, this.factor());
        }
        else if (token.type === INT) {
            this.eat(INT);
            return num(token); 
        }
        else if (token.type === LPAREN) {
            this.eat(LPAREN);
            const node = this.expr();
            this.eat(RPAREN);
            
            return node; 
        }
    }
    /**
     * term: factor ((MUL | DIV) factor) * 
     */
    term(): AstNode {
        const ops = [DIV, MUL];
        let node = this.factor();

        while (ops.includes(this.currentToken.type)) {
            const token = this.currentToken;
            
            this.currentToken.type === TT.MUL 
                ? this.eat(MUL)
                : this.eat(DIV)
            
            node = binaryOperator(node, token, this.factor())
        }

        return node;
    }

    /**
     * expr: term ((PLUS | MINUS) term) *
     * 
     * term: factor ((MUL | DIV) factor) *
     * 
     * factor: INTEGER
     */
    expr(): AstNode {
        const ops = [PLUS, MINUS, DIV, MUL];
        let node = this.term();

        while (ops.includes(this.currentToken.type)) {
            const token = this.currentToken;
            
            this.currentToken.type === PLUS
                ? this.eat(PLUS)
                : this.eat(MINUS)

            node = binaryOperator(node, token, this.term())
        }

        return node;
    }

    parse() {
        return this.expr();
    }
}