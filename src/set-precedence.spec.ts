import { Builder } from './builder';

interface Todo {
	id: number;
	status: string;
}

describe('useSet precedence over base rules', () => {
	it('overrides a value set by ruleFor for the same property', () => {
		const todo = new Builder<Todo>()
			.ruleFor('status', 'pending')
			.addSet('done', { status: 'done' })
			.useSet('done')
			.generate();

		expect(todo).toStrictEqual({ status: 'done' });
	});

	it('overrides a value set by addModel for the same property', () => {
		const todo = new Builder<Todo>()
			.addModel({ id: 1, status: 'pending' })
			.addSet('done', { status: 'done' })
			.useSet('done')
			.generate();

		expect(todo).toStrictEqual({ id: 1, status: 'done' });
	});

	it('leaves properties the set does not define untouched', () => {
		const todo = new Builder<Todo>()
			.ruleFor('id', 1)
			.addSet('done', { status: 'done' })
			.useSet('done')
			.generate();

		expect(todo).toStrictEqual({ id: 1, status: 'done' });
	});
});
