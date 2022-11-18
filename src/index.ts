import { faker } from '@faker-js/faker';
import { Builder } from './builder';

/**
 * Create a new instance of Builder
 * @example
 * 		createBuilder<T>()
 * @return new instance of Builder
 */
export function createBuilder<T>(): Builder<T>;
/**
 * Create a new instance of Builder
 * @param config Initial setup for the builder
 * @example
 * 		createBuilder<{ name: string }>({ name: 'person name' }, 'pt_BR')
 * @return new instance of Builder with presets
 */
export function createBuilder<T>(config: Partial<T>): Builder<T>;
/**
 * Create a new instance of Builder
 * @param config Initial setup for the builder
 * @param locale The locale to set (e.g. `en` or `pt_BR`).
 * @example
 * 		createBuilder<{ name: string }>({ name: 'person name' }, 'pt_BR')
 * @return new instance of Builder with presets
 */
export function createBuilder<T>(config: Partial<T>, locale: string): Builder<T>;
/**
 * Create a new instance of Builder
 * @param config Initial setup for the builder
 * @param locale The locale to set (e.g. `en` or `pt_BR`).
 * @example
 * 		createBuilder<{ name: string }>({ name: 'person name' }, 'pt_BR')
 * @return new instance of Builder with presets
 */
export function createBuilder<T>(config?: Partial<T>, locale?: string): Builder<T> {
	return new Builder<T>(locale).addModel(config ?? {});
}

export function generate<T>(config: Partial<T>): T;
export function generate<T>(config: Partial<T>, length: number): Array<T>;
export function generate<T>(config: Partial<T>, length?: number): T | Array<T> {
	return new Builder<T>().addModel(config).generate(length);
}

/**
 * Set global Faker's locale
 * @param locale The locale to set (e.g. `en` or `pt_BR`).
 * @example
 * 		setLocale('pt_BR')
 */
export function setLocale(locale: string): void {
	faker.setLocale(locale);
}

/**
 * Set global Faker's seed
 * @param seed The seed to set (e.g `1`).
 * @example
 * 		useSeed(1)
 * 	@return The seed that was set
 */
export function useSeed(seed: number): number {
	return faker.seed(seed);
}

export { Builder };
