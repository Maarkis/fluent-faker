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
		// @ts-expect-error - 'not-a-locale' is not a key of allLocales
		const builder = new Builder<Todo>('not-a-locale');

		expect(builder).toBeDefined();
	});
});
