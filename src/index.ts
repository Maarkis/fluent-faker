import { Faker } from '@faker-js/faker';
import { Builder } from './builder';
import { LocaleCode } from './locale';
import isFunction from 'lodash.isfunction';
import { setGlobalSeed } from './seed';

/**
 * Create a new instance of Builder
 * @example
 * 		createBuilder<T>()
 * @return new instance of Builder
 */
export function createBuilder<T>(): Builder<T>;
/**
 * Create a new instance of Builder
 * @param model Initial setup for the builder using faker
 * @example
 * 		createBuilder<{ name: string }>((faker) => ({
 * 			name: faker.name.firstName(),
 * 		}))
 * @return new instance of Builder with presets
 */
export function createBuilder<T>(model: (faker: Faker) => Partial<T>): Builder<T>;
/**
 * Create a new instance of Builder
 * @param model Initial setup for the builder
 * @example
 * 		createBuilder<{ name: string }>({ name: 'person name' })
 * @return new instance of Builder with presets
 */
export function createBuilder<T>(model: Partial<T>): Builder<T>;

/**
 * Create a new instance of Builder
 * @param model Initial setup for the builder
 * @param locale The locale to set (e.g. `en` or `pt_BR`).
 * @example
 * 		createBuilder<{ name: string }>({ name: 'person name' }, 'pt_BR')
 * @return new instance of Builder with presets
 */
export function createBuilder<T>(model: Partial<T>, locale: LocaleCode): Builder<T>;
/**
 * Create a new instance of Builder
 * @param model Initial setup for the builder
 * @param locale The locale to set (e.g. `en` or `pt_BR`).
 * @example
 * 		createBuilder<{ name: string }>((faker) => ({ name: faker.name.firstName() }), 'pt_BR')
 * @return new instance of Builder with presets
 */
export function createBuilder<T>(
	model: (faker: Faker) => Partial<T>,
	locale: LocaleCode,
): Builder<T>;
export function createBuilder<T>(
	model?: Partial<T> | ((faker: Faker) => Partial<T>),
	locale?: LocaleCode,
): Builder<T> {
	if (isFunction(model)) return new Builder<T>(locale).addModel(model);

	return new Builder<T>(locale).addModel(model ?? {});
}

export function generate<T>(model: Partial<T>): T;
export function generate<T>(model: (faker: Faker) => Partial<T>): T;
export function generate<T>(model: (faker: Faker) => Partial<T>, length: number): Array<T>;
export function generate<T>(model: Partial<T>, length: number): Array<T>;
export function generate<T>(model: Partial<T>, length?: number): T | Array<T> {
	const builder = new Builder<T>().addModel(model);
	return length === undefined ? builder.generate() : builder.generate(length);
}

/**
 * Set global Faker's seed
 * @param seed The seed to set (e.g `1`).
 * @example
 * 		useSeed(1)
 * 	@return The seed that was set
 */
export function useSeed(seed?: number): number {
	return setGlobalSeed(seed);
}

export { Builder };
