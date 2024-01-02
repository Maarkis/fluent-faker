import { Builder, createBuilder, generate, useSeed } from './index';
import { faker } from '@faker-js/faker';

describe('Suite test Index', () => {
	it(`${useSeed.name} should set global seed`, () => {
		const spyOnSeed = jest.spyOn(faker, 'seed');
		const seedExpected = faker.number.int();

		const seed = useSeed(seedExpected);

		expect(spyOnSeed).toHaveBeenCalledWith(seedExpected);
		expect(seed).toBe(seedExpected);
	});

	it(`${createBuilder.name} should create instance correctly`, () => {
		const builder = createBuilder();

		expect(builder).toBeTruthy();
	});

	it(`${createBuilder.name} should work and generate instance object correctly`, () => {
		const config: Partial<{ id: number; name: string; lastName: string }> = {
			id: 1,
			name: 'name',
			lastName: 'lastName',
		};
		const value = createBuilder(config).generate();

		expect(value).toStrictEqual({ ...config });
	});

	it(`${createBuilder.name} should work and generate collection correctly`, () => {
		const config: Partial<{ id: number; name: string; lastName: string }> = {
			id: 1,
			name: 'name',
			lastName: 'lastName',
		};

		const value = createBuilder(config).generate(2);

		expect(value).toStrictEqual([{ ...config }, { ...config }]);
	});

	it(`${createBuilder.name} should work and generate correctly using function`, () => {
		const value = createBuilder<{ id: number; name: string; lastName: string }>(() => ({
			id: 12,
			name: 'name',
			lastName: 'lastName',
		})).generate();

		expect(value).toStrictEqual({ id: 12, name: 'name', lastName: 'lastName' });
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

	it(`${generate.name} import correctly`, () => {
		expect(Builder).toBeTruthy();
	});

	it(`${generate.name} import correctly`, () => {
		expect(Builder).toBeTruthy();
	});
});
