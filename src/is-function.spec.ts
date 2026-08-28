import { isFunction } from './is-function';

describe(isFunction.name, () => {
	it('returns true for an arrow function', () => {
		expect(isFunction(() => undefined)).toBe(true);
	});

	it('returns true for a named function', () => {
		function namedFunction(): void {}
		expect(isFunction(namedFunction)).toBe(true);
	});

	it('returns true for a class', () => {
		class SomeClass {}
		expect(isFunction(SomeClass)).toBe(true);
	});

	it.each([
		['a plain object', {}],
		['an array', []],
		['a string', 'value'],
		['a number', 1],
		['a boolean', true],
		['null', null],
		['undefined', undefined],
	])('returns false for %s', (_label, value) => {
		expect(isFunction(value)).toBe(false);
	});
});
