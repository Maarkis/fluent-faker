export interface Rule<T, P extends keyof T> {
	property?: P | string;
	valueFunction: EntityFunction<T> | ValueFunction<T, keyof T>;
}

type ValueFunction<T, P extends keyof T> = (faker: Faker) => T[P];
type EntityFunction<T> = (faker: Faker) => Partial<T>;
