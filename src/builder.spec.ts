import { Builder } from './builder';
import { Faker, faker as fakerJs } from '@faker-js/faker';

jest.useFakeTimers();

interface People {
	id: number;
	active: boolean;
	name: string;
	lastName: string;
	birthday: Date;
	age: number;
	gender: Gender;
	todos: Todo[];
	email: Email;
}

interface Email {
	domain: string;
	email: string;
}

enum Gender {
	Feminine,
	Male,
}

interface Todo {
	id: number;
	name: string;
	description: string;
	completed: boolean;
}

const className = Builder.name;
const addModelName = Builder.prototype.addModel.name;
const ruleForName = Builder.prototype.ruleFor.name;
const generateName = Builder.prototype.generate.name;
const setLocaleName = Builder.prototype.setLocale.name;
const seedName = Builder.prototype.useSeed.name;
const addSetName = Builder.prototype.addSet.name;
const useSetName = Builder.prototype.useSet.name;
const cloneName = Builder.prototype.clone.name;

describe(`Suite test ${Builder.name}`, () => {
	let sut: Builder<People>;
	let faker: Faker;
	let seed: number;
	beforeEach(() => {
		sut = new Builder<People>();

		const locales = fakerJs.locales;
		faker = new Faker({
			locales: locales,
		});

		const localSeed = faker.datatype.number({ min: 1, max: 10000 });
		seed = faker.seed(localSeed);
	});

	it(`should create ${Builder.name}`, () => {
		expect(sut).toBeTruthy();
	});

	it(`should create ${Builder.name} and set its default locale`, () => {
		const builder = new Builder<People>();

		expect(builder.locale).toStrictEqual('en');
	});

	it(`should build ${className} and set its locale correctly`, () => {
		const builder = new Builder<People>('pt_BR');

		expect(builder.locale).toStrictEqual('pt_BR');
	});

	it(`${setLocaleName} should set locale correctly`, () => {
		sut.setLocale('pt_BR');

		expect(sut.locale).toStrictEqual('pt_BR');
	});

	it(`${seedName} should set seed correctly`, () => {
		const seed = sut.useSeed(1);

		expect(seed).toStrictEqual(1);
	});

	it(`${addModelName} should build from complex configuration`, () => {
		const model: Partial<People> = {
			id: 1,
			name: 'name',
			lastName: 'last name',
			active: true,
			todos: [
				{
					completed: true,
					description: 'Description Todo',
					name: 'Todo',
					id: 1,
				},
			],
		};

		const value = sut.addModel(model).generate();

		expect(value).toStrictEqual({ ...model });
	});

	it(`${addModelName} should build a complex configuration using Faker`, () => {
		sut.useSeed(seed);
		const valueExpected = {
			name: faker.name.firstName(),
			lastName: faker.name.lastName(),
			age: faker.datatype.number({ min: 1, max: 99 }),
			birthday: faker.date.past(100),
		};
		const value = sut
			.addModel((f) => ({
				name: f.name.firstName(),
				lastName: f.name.lastName(),
				age: f.datatype.number({ min: 1, max: 99 }),
				birthday: f.date.past(100),
			}))
			.generate();

		expect(value).toStrictEqual({ ...valueExpected });
	});

	it(`${ruleForName} should configure a rule for a string property`, () => {
		const value = sut.ruleFor('name', () => 'Name').generate();

		expect(value).toStrictEqual({ name: 'Name' });
	});

	it(`${ruleForName} should configure a rule for a number property`, () => {
		const value = sut.ruleFor('age', () => 21).generate();

		expect(value).toStrictEqual({ age: 21 });
	});

	it(`${ruleForName} should configure a rule for a boolean property`, () => {
		const value = sut.ruleFor('active', () => false).generate();

		expect(value).toStrictEqual({ active: false });
	});

	it(`${ruleForName} should configure a rule for a enum property`, () => {
		const value = sut.ruleFor('gender', () => Gender.Feminine).generate();

		expect(value).toStrictEqual({ gender: Gender.Feminine });
	});

	it(`${ruleForName} should configure a rule for a array property`, () => {
		const todos: Array<Todo> = [
			{
				id: 1,
				completed: true,
				description: 'Description of todo completed',
				name: 'Todo completed',
			},
			{
				id: 2,
				completed: false,
				description: 'Description of Todo not completed',
				name: 'Todo not completed',
			},
		];
		const value = sut.ruleFor('todos', () => todos).generate();

		expect(value).toStrictEqual({ todos });
	});

	it(`${ruleForName} should configure a rule for a object property`, () => {
		const email: Email = {
			email: 'people@email.com',
			domain: 'email.com',
		};
		const value = sut.ruleFor('email', () => email).generate();

		expect(value).toStrictEqual({ email });
	});

	it(`${ruleForName} should configure a rule for a string property as value`, () => {
		const value = sut.ruleFor('name', 'people name').generate();

		expect(value).toStrictEqual({ name: 'people name' });
	});

	it(`${generateName} should generate instance`, () => {
		const model: Partial<People> = {
			id: 1,
			name: 'name',
		};
		const values = sut.addModel(model).generate(1);

		expect(values).toStrictEqual([model]);
	});

	it(`${generateName} should generate an empty array when the length is zero`, () => {
		const model: Partial<People> = {
			id: 1,
			name: 'name',
		};
		const expectedValues: People[] = [];
		const values = sut.addModel(model).generate(0);

		expect(values).toStrictEqual(expectedValues);
	});

	it.each([-1, -2])(
		`${generateName} should throw error when parameter length be less zero`,
		(length: number) => {
			const model: Partial<People> = {
				id: 1,
				name: 'name',
			};
			const value = () => sut.addModel(model).generate(length);

			expect(value).toThrow('property length be greater than greater than or equal to 0.');
		}
	);

	it(`${generateName} should generate multiple instance`, () => {
		const model: Partial<People> = {
			id: 1,
			name: 'name',
		};
		const values = sut.addModel(model).generate(3);

		expect(values).toStrictEqual([model, model, model]);
		expect(values.length).toBe(3);
	});

	it(`${addSetName} should add a ruleset correctly`, () => {
		const id = 1;
		const name = 'name new people';

		const value = sut.addSet('new people', { id, name }).useSet('new people').generate();

		expect(value).toStrictEqual({ id, name });
	});

	it(`${addSetName} should throw error when you have an item with the same key has already been added`, () => {
		sut.addSet('any set', { id: 1, name: 'name people' });

		const value = () => sut.addSet('any set', { id: 1, name: 'other name people' });

		expect(value).toThrow('An item with the same key has already been added');
	});

	it(`${useSetName} should build object instance from set configuration`, () => {
		const id = 1;
		const name = 'name new people';
		sut.addSet('new people', { id, name });

		const value = sut.useSet('new people').generate();

		expect(value).toStrictEqual({ id, name });
	});

	it(`${useSetName} should build collection from set configuration`, () => {
		const id = 1;
		const name = 'name new people';

		const value = sut.addSet('new people', { id, name }).useSet('new people').generate(1);

		expect(value).toStrictEqual([{ id, name }]);
	});

	it(`${useSetName} should build object instance from set configuration using Faker`, () => {
		faker.seed(seed);
		sut.useSeed(seed);
		const valueExpected = [
			{
				name: faker.name.firstName(),
				lastName: faker.name.lastName(),
			},
			{
				name: faker.name.firstName(),
				lastName: faker.name.lastName(),
			},
		];
		const value = sut
			.addSet('any set', (faker) => ({
				name: faker.name.firstName(),
				lastName: faker.name.lastName(),
			}))
			.useSet('any set')
			.generate(2);

		expect(value).toStrictEqual(valueExpected);
	});

	it(`${useSetName} should building empty object when the set is not found`, () => {
		const value = sut
			.addSet('any set', { id: 1, name: 'name people' })
			.useSet('other set')
			.generate(1);

		expect(value).toStrictEqual([{}]);
	});

	it(`${ruleForName} should override defined set`, () => {
		const id = 1;
		const name = 'name new people';
		const otherName = 'other name';

		const value = sut
			.addSet('new people', {
				id,
				name,
			})
			.ruleFor('name', otherName)
			.useSet('new people')
			.generate(1);

		expect(value).toStrictEqual([{ id, name: otherName }]);
	});

	it(`${cloneName} should generate a ${className} that generates the same values when using presets`, () => {
		const builderToBeCloned = new Builder<People>('pt_BR');
		builderToBeCloned
			.addSet('young person', {
				id: 1,
				name: 'young person name',
				lastName: 'young person lastName',
			})
			.addSet('old person', {
				id: 1,
				name: 'old person name',
				lastName: 'old person lastName',
			});
		const clonedBuilder = builderToBeCloned.clone();

		const youngPerson = builderToBeCloned.useSet('young person').generate();
		const oldPerson = builderToBeCloned.useSet('old person').generate();
		const clonedYoungPerson = clonedBuilder.useSet('young person').generate();
		const clonedOldPerson = builderToBeCloned.useSet('old person').generate();

		expect([youngPerson, oldPerson]).toStrictEqual([clonedYoungPerson, clonedOldPerson]);
	});

	it(`${cloneName} should generate a ${className} that generates the same values when using the same seed`, () => {
		const builderToBeCloned = new Builder<People>('pt_BR');
		builderToBeCloned.useSeed(seed);
		builderToBeCloned
			.addSet('people', { id: 1, name: 'name', lastName: 'lastName' })
			.ruleFor('active', true)
			.ruleFor('gender', () => Gender.Male)
			.ruleFor('id', (faker) => faker.datatype.number());
		const clonedBuilder = builderToBeCloned.clone();

		const valueExpected = builderToBeCloned.generate();
		const value = clonedBuilder.generate();

		expect(value).toStrictEqual(valueExpected);
	});
});
