import { Faker } from '@faker-js/faker';
import reduce from 'lodash.reduce';
import isFunction from 'lodash.isfunction';
import cloneDeep from 'lodash.clonedeep';
import { Locale, getLocale } from './locale';
import { Rule } from './rule';

export class Builder<T> {
	private rules: Rule<T, keyof T>[] = [];
	private rulesSets: Map<string, Rule<T, keyof T>[]> = new Map<string, Rule<T, keyof T>[]>();
	private rulesSetsFactoryFunction: [useSet: boolean, factoryFunction?: () => T] = [false];

	private readonly _locale: Locale;

	/**
	 * The local seed of Faker if available. Null local seed means the Global property is being used.
	 * @private localSeed
	 */
	private localSeed?: number;

	/**
	 * The internal Faker object that is used in (faker) => faker rules.
	 * @private faker
	 */
	private faker: Faker;

	/**
	 * Create Builder
	 * @param locale The locale to set (e.g. `en` or `pt_BR`).
	 * @example
	 * 		new Builder<People>('pt_BR')
	 * @return new instance of Builder
	 */
	constructor(locale?: string) {
		this._locale = getLocale(locale);
		this.faker = new Faker({ locale: this._locale.locale });
	}

	/**
	 * Defines a set of rules. Useful for defining rules for special cases
	 * @param model The dataset to apply when the set is specified, presets are not stored
	 * @example
	 * 		new Builder<People>().addModel({
	 * 			name: 'person name',
	 * 			lastName: 'person last name'
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
			this.addRule({
				valueFunction: model,
			});
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
	 * 			lastName: 'good person last name'
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
			this.addRuleSet(name.toLowerCase(), {
				valueFunction: dataSet,
			});
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
		valueFunction: (faker: Faker) => T[P],
	): Builder<T>;
	public ruleFor<P extends keyof T>(
		property: P,
		valueFunction: T[P] | ((faker: Faker) => T[P]),
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
	 * Get the current locale.
	 * @example
	 * 		new Builder<People>().locale
	 * 		// return 'pt_BR'
	 * 	@return {string} locale string
	 */
	public get locale(): string {
		return this._locale.code;
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
		const builder = new Builder<T>();
		if (this.localSeed) builder.useSeed(this.localSeed);

		builder.rules = this.rules.map<Rule<T, keyof T>>((rule: Rule<T, keyof T>) => {
			return {
				valueFunction: rule.valueFunction,
				property: rule.property,
			};
		});

		this.rulesSets.forEach((rules: Rule<T, keyof T>[], key: string) => {
			const clonedRulesSets = rules.map((rule: Rule<T, keyof T>) => {
				return {
					valueFunction: rule.valueFunction,
					property: rule.property,
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

	private addRuleSets(name: string, rules: Array<Rule<T, keyof T>>): void {
		if (this.rulesSets.has(name))
			throw new Error('An item with the same key has already been added');
		this.rulesSets.set(name, rules);
	}

	private addRuleSet(name: string, rule: Rule<T, keyof T>): void {
		this.addRuleSets(name, [rule]);
	}

	private createRules<T, P extends keyof T>(
		property: P | string,
		valueFunction: () => T[P],
	): Rule<T, P> {
		return {
			valueFunction: valueFunction,
			property: property,
		};
	}

	private createFactoryFunction(rules: Rule<T, keyof T>[]): () => T {
		return () =>
			reduce<Rule<T, keyof T>, T>(
				rules,
				(prev: T, curr: Rule<T, keyof T>): T => ({
					...prev,
					...this.propertyOrObject(curr),
				}),
				{} as T,
			);
	}

	private propertyOrObject(
		rule: Rule<T, keyof T>,
	): { [x: string]: Partial<T> | T[keyof T] } | Partial<T> | T[keyof T] {
		if (rule.property) {
			return { [rule.property]: rule.valueFunction(this.faker) };
		}
		return { ...rule.valueFunction(this.faker) };
	}

	private createRulesWithFaker<T, P extends keyof T>(
		property: P,
		valueFunction: (faker: Faker) => T[P],
	): Rule<T, P> {
		return {
			valueFunction: valueFunction,
			property: property,
		};
	}

	private createRulesByEntries(config: Partial<T>): Rule<T, keyof T>[] {
		const entries = new Map<string, T[keyof T]>(Object.entries(config));
		const rules: Rule<T, keyof T>[] = [];
		for (const [property, value] of entries) {
			const rule: Rule<T, keyof T> = {
				valueFunction: () => value,
				property: property,
			};
			rules.push(rule);
		}
		return rules;
	}
}
