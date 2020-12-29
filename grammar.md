# functions

program                 : PROGRAM variable SEMI block DOT -> ancient BS, remove later

block                   : declarations compound_statement

declarations            : VAR (variable_declaration SEMI)+

variable_declaration    : ID (COMMA ID)* COLON type_spec

type_spec               : STRING 
                        | INTEGER 
                        | FLOAT

compound_statement      : BEGIN statement_list END

statement_list          : statement 
                        | statement LF statement_list 

statement               : compound_statement 
                        | assignment_statement
                        | empty_statement

assignment_statement    : variable (I_ASSIGN | R_ASSIGN) expr

empty                   :

expr                    : term ((PLUS | MINUS) term)*

term                    : factor ((MUL | DIV)) factor*

factor                  : PLUS factor
                        | MINUS factor
                        | INTEGER
                        | FLOAT
                        | LPAREN expr RPAREN
                        | variable

variable                : ID