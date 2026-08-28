import { Builder } from './builder';

interface Todo {
	status: string;
}

describe('clone with an active set', () => {
	it('keeps the active set after cloning', () => {
		const builder = new Builder<Todo>().addSet('done', { status: 'done' }).useSet('done');

		const cloned = builder.clone();

		expect(builder.generate()).toStrictEqual({ status: 'done' });
		expect(cloned.generate()).toStrictEqual({ status: 'done' });
	});

	it('has no active set when none was used before cloning', () => {
		const builder = new Builder<Todo>().addSet('done', { status: 'done' });

		const cloned = builder.clone();

		expect(cloned.generate()).toStrictEqual({});
	});
});
