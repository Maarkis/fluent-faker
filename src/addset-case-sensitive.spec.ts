import { Builder } from './builder';

interface Todo {
	done: boolean;
}

describe('addSet with exact-case names', () => {
	it('allows two sets that only differ by case', () => {
		const builder = new Builder<Todo>()
			.addSet('Done', { done: true })
			.addSet('done', { done: false });

		expect(builder.useSet('Done').generate()).toStrictEqual({ done: true });
		expect(builder.useSet('done').generate()).toStrictEqual({ done: false });
	});

	it('names the duplicate key in the error message', () => {
		const act = (): Builder<Todo> =>
			new Builder<Todo>().addSet('done', { done: true }).addSet('done', { done: false });

		expect(act).toThrow(/'done'/);
	});
});
