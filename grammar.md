# functions

file                    : compound -> represents root scope for now

compound:               : statement_list

statement_list          : statement 
                        | statement SEMI statement_list 

statement               : function_declaration 
                        | function_call
                        | variable_declaration
                        | empty_statement

function_declaration    : type_spec? ID F_ASSIGN parameter_list LBRACE compound RBRACE
// parameter_list
// parameter

function_call           : object_accessor LPAREN argument_list RPAREN

argument_list           : ID (COMMA ID) *
object_accessor         : ID (BRACKET_ACCESSOR | (DOT ID))*
bracket_accessor        : LBRACKET (ID | STRING) RBRACKET

variable_declaration    : type_spec? variable_reference (COMMA variable_reference)* 

variable_reference      : (assignement_statement | variable)

assignment_statement    : variable (I_ASSIGN | R_ASSIGN) expr

type_spec               : STRING 
                        | INTEGER 
                        | FLOAT

compound_statement      : BEGIN statement_list END



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