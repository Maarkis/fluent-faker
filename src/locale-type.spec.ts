import { Builder } from './builder';

interface Todo {
	id: number;
}

describe('locale parameter typing', () => {
	it('accepts a known locale code', () => {
		const builder = new Builder<Todo>('pt_BR');

		expect(builder.locale).toBe('pt_BR');
	});

	it('rejects an unknown locale code at compile time', () => {
		const act = (): Builder<Todo> =>
			// @ts-expect-error - 'not-a-locale' is not a key of allLocales; at
			// runtime, invalid codes now throw instead of silently defaulting.
			new Builder<Todo>('not-a-locale');

		expect(act).toThrow(/Unknown locale: 'not-a-locale'/);
	});
});
