import { Builder } from './builder';

interface Todo {
	id: number;
}

describe('generate with a large length', () => {
	it('does not overflow the call stack', () => {
		const values = new Builder<Todo>().ruleFor('id', 1).generate(200_000);

		expect(values).toHaveLength(200_000);
		expect(values[0]).toStrictEqual({ id: 1 });
		expect(values[199_999]).toStrictEqual({ id: 1 });
	});
});
