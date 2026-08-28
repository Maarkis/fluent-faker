import { Builder } from './builder';
import { faker as en } from '@faker-js/faker/locale/en';
import { allLocales } from '@faker-js/faker';

interface Todo {
	id: number;
}

describe('constructing a Builder from a Faker locale instance', () => {
	it('accepts a pre-built Faker instance and uses its locale', () => {
		const builder = new Builder<Todo>(en);

		expect(builder.locale).toBe('custom');
		expect(builder.ruleFor('id', (faker) => faker.number.int()).generate().id).toEqual(
			expect.any(Number),
		);
	});

	it('accepts a LocaleDefinition object directly', () => {
		const builder = new Builder<Todo>(allLocales.pt_BR);

		expect(builder.locale).toBe('custom');
	});
});
