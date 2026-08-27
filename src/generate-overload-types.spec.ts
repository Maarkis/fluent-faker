import { Builder } from './builder';

interface Todo {
	id: number;
}

describe('generate(length) overload types', () => {
	it('returns a single T when called without a length', () => {
		const todo = new Builder<Todo>().ruleFor('id', 1).generate();

		expect(todo).toStrictEqual({ id: 1 });
	});

	it('returns Array<T> when called with a length', () => {
		const todos = new Builder<Todo>().ruleFor('id', 1).generate(2);

		expect(todos).toStrictEqual([{ id: 1 }, { id: 1 }]);
	});

	it('rejects a possibly-undefined length at compile time', () => {
		const maybeLength: number | undefined = undefined;
		const builder = new Builder<Todo>().ruleFor('id', 1);

		// @ts-expect-error - length must be `number`, not `number | undefined`; the
		// removed third overload used to silently accept this and type the result
		// as Array<Todo> even though a single Todo is returned at runtime.
		const value = builder.generate(maybeLength);

		expect(value).toBeDefined();
	});
});
