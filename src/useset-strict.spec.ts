import { Builder } from './builder';

interface Todo {
	done: boolean;
}

describe('useSet with an unknown name', () => {
	it('throws instead of failing silently', () => {
		const act = (): Builder<Todo> =>
			new Builder<Todo>().addSet('done', { done: true }).useSet('typo');

		expect(act).toThrow(/Unknown set: 'typo'/);
	});

	it('lists the defined sets in the message', () => {
		const act = (): Builder<Todo> =>
			new Builder<Todo>()
				.addSet('done', { done: true })
				.addSet('pending', { done: false })
				.useSet('archived');

		expect(act).toThrow(/Defined sets are: 'done', 'pending'\./);
	});

	it('says no sets were defined when there are none', () => {
		const act = (): Builder<Todo> => new Builder<Todo>().useSet('done');

		expect(act).toThrow(/No sets were defined on this builder\./);
	});
});
