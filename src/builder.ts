import { Faker, faker } from '@faker-js/faker';
import reduce from 'lodash.reduce';
import isFunction from 'lodash.isfunction';
import cloneDeep from 'lodash.clonedeep';

const locales = faker.locales;

type ValueFunction<T, P extends keyof T> = (faker: Faker) => T[P];

interface Rule<T, P extends keyof T> {
	property: P | string;
	value: T[keyof T];
	valueFunction: ValueFunction<T, keyof T>;
}

export class Builder<T> {
	private _rules: Rule<T, keyof T>[] = [];
	private _rulesSets: Map<string, Rule<T, keyof T>[]> = new Map<string, Rule<T, keyof T>[]>();
	private _locale = 'en';
	private _rulesSetsFactoryFunction: [useSet: boolean, factoryFunction?: () => T] = [false];

	/**
	 * The local seed of Faker if available. Null local seed means the Global property is being used.
	 * @private _seed
	 */
	private _seed?: number;

	/**
	 * The internal Faker object that is used in (faker) => faker rules.
	 * @private _faker
	 */
	private readonly _faker: Faker;

	/**
	 * Create Builder
	 * @param locale The locale to set (e.g. `en` or `pt_BR`).
	 * @example
	 * 		new Builder<People>('pt_BR')
	 * @return new instance of Builder
	 */
	constructor(locale?: string) {
		this._faker = new Faker({ locales });
		this.setLocale(locale ?? this._locale);
	}

	/**
	 * Defines a set of rules under a specific name. Useful for defining rules for special cases
	 * @param config The dataset to apply when the set is specified, presets are not stored
	 * @example
	 * 		new Builder<People>().addModel({
	 * 			name: 'person name',
	 * 			lastName: 'person lastname'
	 * 		})
	 * @return instance of Builder
	 */
	public addModel(config: Partial<T>): Builder<T> {
		const clone = cloneDeep(config);
		this._rules.push(...this.createRulesByEntries(clone));
		return this;
	}

	/**
	 * Defines a set of rules under a specific name. Useful for defining rules for special cases
	 * @param name  The set name
	 * @param config The dataset to apply when the set is specified, presets are stored
	 * @example
	 * 		new Builder<People>().addSet('good person', {
	 * 			name: 'good person name',
	 * 			lastName: 'good person lastname'
	 * 		})
	 * @return instance of Builder
	 */
	public addSet(name: string, config: Partial<T>): Builder<T> {
		const clone = cloneDeep(config);
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
		const rulesSets = this._rulesSets.get(name.toLowerCase());
		if (!rulesSets) {
			return this;
		}

		this._rulesSetsFactoryFunction = [true, this.createFactoryFunction(rulesSets)];
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

		const [useSet, rulesSetsFactory] = this._rulesSetsFactoryFunction;
		const rulesFactoryFunction = this.createFactoryFunction(this._rules);
		const factoryFunction =
			useSet && rulesSetsFactory
				? () => ({
						...rulesSetsFactory(),
						...rulesFactoryFunction(),
				  })
				: () => ({
						...rulesFactoryFunction(),
				  });

		const instance =
			length || length == 0
				? this.buildWithQuantity(length, factoryFunction)
				: this.build(factoryFunction);

		this.resetRules();
		return instance;
	}

	/**
	 * Set Faker's locale
	 * @param locale The locale to set (e.g. `en` or `pt_BR`).
	 * @example
	 * 		new Builder<People>().setLocale('pt_BR')
	 */
	public setLocale(locale: string): void {
		this._faker.setLocale(locale);
		this._locale = locale;
	}

	/**
	 * Get the current locale.
	 * @example
	 * 		new Builder<People>().locale
	 * 		// return 'pt_BR'
	 * 	@return locale string
	 */
	public get locale(): string {
		return this._locale;
	}

	/**
	 * Set Faker's seed
	 * @param seed The seed to set (e.g `1`).
	 * @example
	 * 		new Builder<People>().useSeed(1)
	 * 	@return The seed that was set
	 */
	public useSeed(seed: number): number {
		return (this._seed = this._faker.seed(seed));
	}

	/**
	 * Clone hte internal state into a new so that both are isolated from each other
	 * @example
	 * 		const otherBuilder = new Builder<People>().clone()
	 * @return  new Builder instance with cloned builder configuration
	 */
	public clone(): Builder<T> {
		const builder = new Builder<T>(this._locale);
		if (this._seed) builder.useSeed(this._seed);

		builder._rules = this._rules.map<Rule<T, keyof T>>((rule: Rule<T, keyof T>) => {
			return {
				valueFunction: rule.valueFunction,
				property: rule.property,
				value: rule.valueFunction(builder._faker),
			};
		});

		this._rulesSets.forEach((rules: Rule<T, keyof T>[], key: string) => {
			const clonedRulesSets = rules.map((rule: Rule<T, keyof T>) => {
				return {
					valueFunction: rule.valueFunction,
					property: rule.property,
					value: rule.valueFunction(builder._faker),
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
		this._rules.push(rule);
	}

	private addRuleSets(name: string, rules: Array<Rule<T, keyof T>>): void {
		this._rulesSets.set(name, rules);
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
					[curr.property]: curr.valueFunction(this._faker),
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
			value: valueFunction(this._faker),
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

	private resetRules(): void {
		this._rules.length = 0;
		this._rulesSetsFactoryFunction = [false];
	}
}
