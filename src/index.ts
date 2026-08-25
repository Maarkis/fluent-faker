import { Faker } from '@faker-js/faker';
import { Builder, MAX_GENERATE_LENGTH } from './builder';
import { isFunction } from './internal';
import { clearGlobalSeed, setGlobalSeed } from './seed';

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
 * 			name: faker.person.firstName(),
 * 		}))
 * @return new instance of Builder with presets
 */
export function createBuilder<T>(model: (faker: Faker) => Partial<T>): Builder<T, keyof T>;
/**
 * Create a new instance of Builder
 * @param model Initial setup for the builder
 * @example
 * 		createBuilder<{ name: string }>({ name: 'person name' })
 * @return new instance of Builder with presets
 */
export function createBuilder<T>(model: Partial<T>): Builder<T, keyof T>;

/**
 * Create a new instance of Builder
 * @param model Initial setup for the builder
 * @param locale The locale to set (e.g. `en` or `pt_BR`).
 * @example
 * 		createBuilder<{ name: string }>({ name: 'person name' }, 'pt_BR')
 * @return new instance of Builder with presets
 */
export function createBuilder<T>(model: Partial<T>, locale: string): Builder<T, keyof T>;
/**
 * Create a new instance of Builder
 * @param model Initial setup for the builder
 * @param locale The locale to set (e.g. `en` or `pt_BR`).
 * @example
 * 		createBuilder<{ name: string }>((faker) => ({ name: faker.person.firstName() }), 'pt_BR')
 * @return new instance of Builder with presets
 */
export function createBuilder<T>(
	model: (faker: Faker) => Partial<T>,
	locale: string,
): Builder<T, keyof T>;
export function createBuilder<T>(
	model?: Partial<T> | ((faker: Faker) => Partial<T>),
	locale?: string,
): Builder<T> {
	if (isFunction(model)) return new Builder<T>(locale).addModel(model);

	return new Builder<T>(locale).addModel(model ?? {});
}

export function generate<T>(model: Partial<T>): T;
export function generate<T>(model: (faker: Faker) => Partial<T>): T;
export function generate<T>(model: (faker: Faker) => Partial<T>, length: number): Array<T>;
export function generate<T>(model: Partial<T>, length: number): Array<T>;
export function generate<T>(model: Partial<T>, length?: number): T | Array<T> {
	return new Builder<T>().addModel(model).generate(length);
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

export { Builder, MAX_GENERATE_LENGTH };

/**
 * Clears the global seed set by {@link useSeed}.
 *
 * Builders created afterwards, and existing ones that have not generated yet,
 * go back to unseeded behaviour. A Builder with its own seed is unaffected.
 * @example
 * 		afterEach(() => clearSeed())
 */
export function clearSeed(): void {
	clearGlobalSeed();
}

/**
 * A model accepted by {@link createFactory}: a partial object, or a function
 * that receives a Faker instance and returns one.
 */
export type Model<T> = Partial<T> | ((faker: Faker) => Partial<T>);

/**
 * The properties a given model fills, extracted from the model's own type.
 */
export type FilledBy<T, M> = M extends (faker: Faker) => infer R
	? keyof R & keyof T
	: keyof M & keyof T;

/**
 * Creates a Builder that tracks which properties it can actually fill, so
 * `generate()` returns that shape instead of claiming a complete `T`.
 *
 * Called in two steps because TypeScript has no partial type argument
 * inference: naming `T` explicitly in a single call would stop the model type
 * from being inferred. The first call fixes `T`, the second infers the model.
 *
 * @example
 * 		const todo = createFactory<Todo>()({ id: 1 }).generate()
 * 		// todo: Pick<Todo, 'id'> - assigning it to a Todo is a compile error
 * @example
 * 		const todo = createFactory<Todo>()({ id: 1 })
 * 			.ruleFor('name', 'Todo 1')
 * 			.ruleFor('done', false)
 * 			.generate()
 * 		// todo: Todo - every property is accounted for
 * @return A function that takes the model and an optional locale
 */
export function createFactory<T>(): <M extends Model<T>>(
	model: M,
	locale?: string,
) => Builder<T, FilledBy<T, M>> {
	return <M extends Model<T>>(model: M, locale?: string): Builder<T, FilledBy<T, M>> => {
		const builder = new Builder<T, FilledBy<T, M>>(locale);
		return builder.addModel(model as Partial<T>) as unknown as Builder<T, FilledBy<T, M>>;
	};
}
