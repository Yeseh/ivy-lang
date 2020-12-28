import { Token, TT, getToken } from '../token';
import { Num, BinaryOperator, binaryOperator, num } from './ast-nodes';

const { MUL, PLUS, INT } = TT;

const mulToken = getToken(MUL, '*'),
    plusToken = getToken(PLUS, '+'),
    mulNode = binaryOperator(
        num(getToken(INT, 2)),
        mulToken,
        num(getToken(INT, 7))
    ),
    addNode = binaryOperator(
        mulNode,
        plusToken,
        num(getToken(INT, 3))
    )

