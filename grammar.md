# functions

compound_statement      : function_declaration RBRACE statement_list LBRACE
function_declaration    : ID FUNC_INIT LPAREN param_list RPAREN

param_list              : LPAREN (ID COMMA)* RPAREN

statement_list          : statement 
                        | statement LF statement_list 

statement               : compound_statement 
                        | assignment_statement
                        | empty_statement