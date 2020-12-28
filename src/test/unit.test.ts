import { run } from '../ivy';

describe('Interpreter', () => {
    describe('Arithmetic expressions', () => {
        it('Should handle simple subtraction', () => {
            const expr = ['1 + 2', '1+1', '10+10', '100+3']

            const result = expr.map(e => {
                return run(e);
            })

            expect(result).toEqual([3, 2, 20, 103]);
        })
        
        it('Should handle simple addition', () => {
            const expr = ['6-4', '10-8', '50-36', '100-3']

            const result = expr.map(e => {
                return run(e);
            })

            expect(result).toEqual([2, 2, 14, 97]);
        })

        it('Should handle simple multiplication', () => {
            const expr = ['6*4', '10*8', '5*8', '100*3']

            const result = expr.map(e => {
                return run(e);
            })

            expect(result).toEqual([24, 80, 40, 300]);
        })
        
        it('Should handle simple division', () => {
            const expr = ['6/2', '10/5', '50/10', '110/10']

            const result = expr.map(e => {
                return run(e);
            })

            expect(result).toEqual([3, 2, 5, 11]);
        })

        it('Should correctly handle chained arithmetic', () => {
            const expr = [
                '6+3*5',
                '10*5+3',
                '25/5-3+2/2'
            ]
            
            const result = expr.map(e => {
                return run(e);
            })

            expect(result).toEqual([21, 53, 3]);
        })

        it('Should correctly handle parenthesised arithmetic', () => {
            const expr = [
                '(1+3)*4',
                '(12 * (4+6)) + 5',
                '7 + 3 * (10 / (12 / (3+1) - 1))',
                '7 + 3 * (10 / (12 / (3 + 1) - 1)) / (2 + 3) - 5 - 3 + (8)'
            ]

            const result = expr.map(e => {
                return run(e);
            })

            expect(result).toEqual([16, 125, 22, 10]);
        })
    })

    it('Should correctly handle unary operators', () => {
        const expr = [
            '- 3',
            '+ 3',
            '-2 + 3',
            '--2 + 3',
            '-(3+2) ++-10'
        ]

        const result = expr.map(e => {
            return run(e);
        })

        expect(result).toEqual([-3, 3, 1, 5, -15]);
    })
})