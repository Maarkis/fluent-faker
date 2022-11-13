import { createBuilder, generate, setLocale, useSeed } from './index';
import { faker } from '@faker-js/faker';

describe('Suite test Index', () => {
	it(`${setLocale.name} should set global locale`, () => {
		const spyOnLocale = jest.spyOn(faker, 'setLocale');

		setLocale('pt_BR');

		expect(spyOnLocale).toBeCalledWith('pt_BR');
	});

	it(`${useSeed.name} should set global seed`, () => {
		const spyOnSeed = jest.spyOn(faker, 'seed');
		const seedExpected = faker.datatype.number();

		const seed = useSeed(seedExpected);

		expect(spyOnSeed).toBeCalledWith(seedExpected);
		expect(seed).toBe(seedExpected);
	});

	it(`${createBuilder.name} should create instance correctly`, () => {
		const builder = createBuilder();

		expect(builder).toBeTruthy();
	});

	it(`${createBuilder.name} should work and generate instance object correctly`, () => {
		const config: Partial<{ id: 1; name: string; lastName: string }> = {
			id: 1,
			name: 'name',
			lastName: 'lastName',
		};
		const value = createBuilder(config).generate();

		expect(value).toStrictEqual({ ...config });
	});

	it(`${createBuilder.name} should work and generate collection correctly`, () => {
		const config: Partial<{ id: 1; name: string; lastName: string }> = {
			id: 1,
			name: 'name',
			lastName: 'lastName',
		};

		const value = createBuilder(config).generate(2);

		expect(value).toStrictEqual([{ ...config }, { ...config }]);
	});

	it(`${createBuilder.name} should set locale correctly`, () => {
		const value = createBuilder({ name: 'name' }, 'pt_BR');

		expect(value.locale).toStrictEqual('pt_BR');
	});

	it(`${generate.name} should generate object instance correctly`, () => {
		const config: Partial<{ id: 1; name: string; lastName: string }> = {
			id: 1,
			name: 'name',
			lastName: 'lastName',
		};

		const value = generate(config);

		expect(value).toStrictEqual({ ...config });
	});

	it(`${generate.name} should generate collection correctly`, () => {
		const config: Partial<{ id: 1; name: string; lastName?: string }> = {
			id: 1,
			name: 'name',
		};

		const value = generate(config, 2);

		expect(value).toStrictEqual([{ ...config }, { ...config }]);
	});
});
