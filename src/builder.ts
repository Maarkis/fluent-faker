import { Faker, faker as FakerJs } from '@faker-js/faker';
import reduce from 'lodash.reduce';
import isFunction from 'lodash.isfunction';
import cloneDeep from 'lodash.clonedeep';

const locales = FakerJs.locales;

type ValueFunction<T, P extends keyof T> = (faker: Faker) => T[P];

interface Rule<T, P extends keyof T> {
	property: P | string;
	value: T[keyof T];
	valueFunction: ValueFunction<T, keyof T>;
}

export class Builder<T> {
	private rules: Rule<T, keyof T>[] = [];
	private rulesSets: Map<string, Rule<T, keyof T>[]> = new Map<string, Rule<T, keyof T>[]>();
	private rulesSetsFactoryFunction: [useSet: boolean, factoryFunction?: () => T] = [false];

	private localLocale = 'en';

	/**
	 * The local seed of Faker if available. Null local seed means the Global property is being used.
	 * @private localSeed
	 */
	private localSeed?: number;

	/**
	 * The internal Faker object that is used in (faker) => faker rules.
	 * @private faker
	 */
	private readonly faker: Faker;

	/**
	 * Create Builder
	 * @param locale The locale to set (e.g. `en` or `pt_BR`).
	 * @example
	 * 		new Builder<People>('pt_BR')
	 * @return new instance of Builder
	 */
	constructor(locale?: string) {
		this.faker = new Faker({ locales });
		this.setLocale(locale ?? this.localLocale);
	}

	/**
	 * Defines a set of rules. Useful for defining rules for special cases
	 * @param model The dataset to apply when the set is specified, presets are not stored
	 * @example
	 * 		new Builder<People>().addModel({
	 * 			name: 'person name',
	 * 			lastName: 'person lastname'
	 * 		})
	 * @return instance of Builder
	 */
	public addModel(model: Partial<T>): Builder<T>;
	/**
	 * Defines a set of rules under a specific name. Useful for defining rules for special cases
	 * @param model The dataset to apply when the set is specified, presets are not stored
	 * @example
	 * 		new Builder<People>().addModel(faker => ({
	 * 			name: faker.name.firstName(),
	 * 			lastName: faker.name.lastName()
	 * 		}))
	 * @return instance of Builder
	 */
	public addModel(model: (faker: Faker) => Partial<T>): Builder<T>;
	public addModel(model: Partial<T> | ((faker: Faker) => Partial<T>)): Builder<T> {
		if (isFunction(model)) {
			// TODO REFACTOR - BUG GENERATED SAME VALUES
			this.addRules(this.createRulesByEntries(model(this.faker)));
			return this;
		}
		const clone = cloneDeep(model);
		this.rules.push(...this.createRulesByEntries(clone));
		return this;
	}

	/**
	 * Defines a set of rules under a specific name. Useful for defining rules for special cases
	 * @param name  The set name
	 * @param dataSet The dataset to apply when the set is specified, presets are stored
	 * @example
	 * 		new Builder<People>().addSet('good person', {
	 * 			name: 'good person name',
	 * 			lastName: 'good person lastname'
	 * 		})
	 * @return instance of Builder
	 */
	public addSet(name: string, dataSet: Partial<T>): Builder<T>;
	/**
	 * Defines a set of rules under a specific name. Useful for defining rules for special cases
	 * @param name  The set name
	 * @param dataSet The dataset to apply when the set is specified, presets are stored
	 * @example
	 * 		new Builder<People>().addSet('good person', faker => ({
	 * 			name: faker.name.firstName(),
	 * 			lastName: faker.name.lastName()
	 * 		}))
	 * @return instance of Builder
	 */
	public addSet(name: string, dataSet: (faker: Faker) => Partial<T>): Builder<T>;
	public addSet(name: string, dataSet: Partial<T> | ((faker: Faker) => Partial<T>)): Builder<T> {
		if (isFunction(dataSet)) {
			// TODO REFACTOR - BUG GENERATED SAME VALUES
			this.addRuleSets(name.toLowerCase(), this.createRulesByEntries(dataSet(this.faker)));
			return this;
		}

		const clone = cloneDeep(dataSet);
		this.addRuleSets(name.toLowerCase(), this.createRulesByEntries(clone));
		return this;
	}

	/**
	 * Uses a set of predefined rules
	 * @param name The set name
	 * @example
	 * 		new Builder<People>()
	 * 			.addSet('good person', { name: 'good person name' })
	 * 			.useSet('good person')
	 * @return instance of Builder
	 */
	public useSet(name: string): Builder<T> {
		const rulesSets = this.rulesSets.get(name.toLowerCase());
		if (!rulesSets) {
			return this;
		}

		this.rulesSetsFactoryFunction = [true, this.createFactoryFunction(rulesSets)];
		return this;
	}

	public ruleFor<P extends keyof T>(property: P, valueFunction: T[P]): Builder<T>;
	public ruleFor<P extends keyof T>(
		property: P,
		valueFunction: (faker: Faker) => T[P]
	): Builder<T>;
	public ruleFor<P extends keyof T>(
		property: P,
		valueFunction: T[P] | ((faker: Faker) => T[P])
	): Builder<T> {
		if (isFunction(valueFunction)) {
			this.addRule(this.createRulesWithFaker(property, valueFunction));
			return this;
		}

		this.addRule(this.createRules(property, () => valueFunction));
		return this;
	}

	/**
	 * Generates an instance of type
	 * @example
	 * 		new Builder<People>().generate()
	 * 		return new instance of People
	 * @return The generated instance of type {T}
	 */
	public generate(): T;
	/**
	 * Generates a collection of instances of the type
	 * @param length The number of instances to spawn
	 * @example
	 * 		new Builder<People>().generate(2)
	 * 		return new collection of People
	 * @return The collection of generated instances of type {T}
	 */
	public generate(length: number): Array<T>;
	/**
	 * Generate an instances or collection of instances of the type
	 * @param length The number of instances to spawn
	 * @example
	 * 		new Builder<People>().generate(2)
	 * 		return new collection of People
	 * @return The collection of generated instances of type {T}
	 */
	public generate(length?: number): Array<T>;
	/**
	 * Generate an instances or collection of instances of the type
	 * @param length The number of instances to spawn
	 * @example
	 * 		new Builder<People>().generate(2)
	 * 		return new collection of People
	 * @return The collection of generated instances of type {T}
	 */
	public generate(length?: number): T | Array<T> {
		if (length && length < 0)
			throw new Error('property length be greater than greater than or equal to 0.');

		const [useSet, rulesSetsFactoryFunction] = this.rulesSetsFactoryFunction;
		const rulesFactoryFunction = this.createFactoryFunction(this.rules);
		const factoryFunction =
			useSet && rulesSetsFactoryFunction
				? () => ({
						...rulesSetsFactoryFunction(),
						...rulesFactoryFunction(),
				  })
				: () => ({
						...rulesFactoryFunction(),
				  });

		return length || length == 0
			? this.buildWithQuantity(length, factoryFunction)
			: this.build(factoryFunction);
	}

	/**
	 * Set Faker's locale
	 * @param locale The locale to set (e.g. `en` or `pt_BR`).
	 * @example
	 * 		new Builder<People>().setLocale('pt_BR')
	 */
	public setLocale(locale: string): void {
		this.faker.setLocale(locale);
		this.localLocale = locale;
	}

	/**
	 * Get the current locale.
	 * @example
	 * 		new Builder<People>().locale
	 * 		// return 'pt_BR'
	 * 	@return locale string
	 */
	public get locale(): string {
		return this.localLocale;
	}

	/**
	 * Set Faker's seed
	 * @param seed The seed to set (e.g `1`).
	 * @example
	 * 		new Builder<People>().useSeed(1)
	 * 	@return The seed that was set
	 */
	public useSeed(seed: number): number {
		return (this.localSeed = this.faker.seed(seed));
	}

	/**
	 * Clone hte internal state into a new so that both are isolated from each other
	 * @example
	 * 		const otherBuilder = new Builder<People>().clone()
	 * @return  new Builder instance with cloned builder configuration
	 */
	public clone(): Builder<T> {
		const builder = new Builder<T>(this.localLocale);
		if (this.localSeed) builder.useSeed(this.localSeed);

		builder.rules = this.rules.map<Rule<T, keyof T>>((rule: Rule<T, keyof T>) => {
			return {
				valueFunction: rule.valueFunction,
				property: rule.property,
				value: rule.valueFunction(builder.faker),
			};
		});

		this.rulesSets.forEach((rules: Rule<T, keyof T>[], key: string) => {
			const clonedRulesSets = rules.map((rule: Rule<T, keyof T>) => {
				return {
					valueFunction: rule.valueFunction,
					property: rule.property,
					value: rule.valueFunction(builder.faker),
				};
			});
			builder.addRuleSets(key, clonedRulesSets);
		});

		return builder;
	}

	private build(factory: () => T): T {
		return factory();
	}

	private buildWithQuantity(length: number, factory: () => T): Array<T> {
		return length === 0
			? Array.from<T>({ length: length })
			: Array.apply(0, Array<T>(length)).map(() => factory());
	}

	private addRule(rule: Rule<T, keyof T>): void {
		this.rules.push(rule);
	}

	private addRules(rules: Rule<T, keyof T>[]): void {
		this.rules.push(...rules);
	}

	private addRuleSets(name: string, rules: Array<Rule<T, keyof T>>): void {
		if (this.rulesSets.has(name))
			throw new Error('An item with the same key has already been added');
		this.rulesSets.set(name, rules);
	}

	private createRules<T, P extends keyof T>(
		property: P | string,
		valueFunction: () => T[P]
	): Rule<T, P> {
		return {
			valueFunction: valueFunction,
			property: property,
			value: valueFunction(),
		};
	}

	private createFactoryFunction(rules: Rule<T, keyof T>[]): () => T {
		return () =>
			reduce<Rule<T, keyof T>, T>(
				rules,
				(prev: T, curr: Rule<T, keyof T>): T => ({
					...prev,
					[curr.property]: curr.valueFunction(this.faker),
				}),
				{} as T
			);
	}

	private createRulesWithFaker<T, P extends keyof T>(
		property: P,
		valueFunction: (faker: Faker) => T[P]
	): Rule<T, P> {
		return {
			valueFunction: valueFunction,
			property: property,
			value: valueFunction(this.faker),
		};
	}

	private createRulesByEntries(config: Partial<T>): Rule<T, keyof T>[] {
		const entries = new Map<string, T[keyof T]>(Object.entries(config));
		const rules: Rule<T, keyof T>[] = [];
		for (const [property, value] of entries) {
			const rule: Rule<T, keyof T> = {
				valueFunction: () => value,
				property: property,
				value: value,
			};
			rules.push(rule);
		}
		return rules;
	}
}
