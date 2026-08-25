import { faker } from '@faker-js/faker';

let globalSeed: number | undefined;

/**
 * Sets the global seed. Every Builder created (or not yet generated) will
 * derive its own PRNG state from it.
 * @param seed The seed to set. When omitted, a random seed is generated.
 * @return The seed that was set
 */
export function setGlobalSeed(seed?: number): number {
	globalSeed = faker.seed(seed);
	return globalSeed;
}

/**
 * @return The current global seed, or undefined when none was set.
 */
export function getGlobalSeed(): number | undefined {
	return globalSeed;
}
