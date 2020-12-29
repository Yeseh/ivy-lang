import { run } from '../ivy';

const ex = (cnt: string) => {
	return `BEGIN ${cnt} END.`;
};

describe('Interpreter', () => {
	describe('Arithmetic expressions', () => {
		it('Should handle simple addition', () => {
			const expr = [
				'a := 1 + 2;',
				'a := 1+1;',
				'a := 10+10;',
				'a := 100+3;',
			];

			const tests = expr.map(e => ex(e));

			const result = tests.map(e => {
				return run(e).a;
			});

			expect(result).toEqual([3, 2, 20, 103]);
		});

		it('Should handle simple subtraction', () => {
			const expr = [
				'a := 6-4;',
				'a := 10-8;',
				'a := 50-36;',
				'a := 100-3;',
			];

			const tests = expr.map(e => ex(e));

			const result = tests.map(e => {
				return run(e).a;
			});

			expect(result).toEqual([2, 2, 14, 97]);
		});

		it('Should handle simple multiplication', () => {
			const expr = [
				'a := 6*4;',
				'a := 10*8;',
				'a := 5*8;',
				'a := 100*3;',
			];

			const tests = expr.map(e => ex(e));

			const result = tests.map(e => {
				return run(e).a;
			});

			expect(result).toEqual([24, 80, 40, 300]);
		});

		it('Should handle simple division', () => {
			const expr = [
				'a := 6/2;',
				'a := 10/5;',
				'a := 50/10;',
				'a := 110/10;',
			];

			const tests = expr.map(e => ex(e));

			const result = tests.map(e => {
				return run(e).a;
			});

			expect(result).toEqual([3, 2, 5, 11]);
		});

		it('Should handle chained arithmetic', () => {
			const expr = [
				'a := 6+3*5',
				'a := 10*5+3',
				'a := 25/5-3+2/2',
			];

			const tests = expr.map(e => ex(e));

			const result = tests.map(e => {
				return run(e).a;
			});

			expect(result).toEqual([21, 53, 3]);
		});

		it('Should handle parenthesised arithmetic', () => {
			const expr = [
				'a := (1+3)*4;',
				'a := (12 * (4+6)) + 5;',
				'a := 7 + 3 * (10 / (12 / (3+1) - 1));',
				'a := 7 + 3 * (10 / (12 / (3 + 1) - 1)) / (2 + 3) - 5 - 3 + (8);',
			];

			const tests = expr.map(e => ex(e));

			const result = tests.map(e => {
				return run(e).a;
			});

			expect(result).toEqual([16, 125, 22, 10]);
		});

		it('Should handle unary operators', () => {
			const expr = [
				'a := - 3;',
				'a := + 3;',
				'a := -2 + 3;',
				'a := --2 + 3;',
				'a := -(3+2) ++-10;',
			];

			const tests = expr.map(e => ex(e));

			const result = tests.map(e => {
				return run(e).a;
			});

			expect(result).toEqual([-3, 3, 1, 5, -15]);
		});
	});

	it('Should correctly assign variables', () => {
		const expr = ex('a := 1; test := a;');

		const result = run(expr);

		expect(result.a).toBe(1);
		expect(result.test).toBe(1);
	});

	it('Should correctly handle compound statements', () => {
		const expr = `
            BEGIN
                BEGIN
                    number := 2;
                    a := number;
                    b := 10 * a + 10 * number / 4;
                    c := a - - b;
                END;
                x := 11;
            END.
        `;
		const result = run(expr);

		expect(result).toBeDefined();
		expect(result.a).toBe(2);
		expect(result.b).toBe(25);
		expect(result.c).toBe(27);
		expect(result.x).toBe(11);
	});
})
;
