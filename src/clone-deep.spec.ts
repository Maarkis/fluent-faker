import { cloneDeep } from './clone-deep';

describe(cloneDeep.name, () => {
	it.each([
		['a number', 1],
		['a string', 'value'],
		['a boolean', true],
		['null', null],
		['undefined', undefined],
	])('returns %s unchanged', (_label, value) => {
		expect(cloneDeep(value)).toBe(value);
	});

	it('deep clones a plain object, isolating it from later mutation of the source', () => {
		const source = { a: 1, nested: { b: 2 } };
		const clone = cloneDeep(source);
		source.nested.b = 999;

		expect(clone).toEqual({ a: 1, nested: { b: 2 } });
		expect(clone).not.toBe(source);
		expect(clone.nested).not.toBe(source.nested);
	});

	it('deep clones an array, isolating it from later mutation of the source', () => {
		const source = [{ a: 1 }];
		const clone = cloneDeep(source);
		source[0].a = 999;

		expect(clone).toEqual([{ a: 1 }]);
		expect(clone).not.toBe(source);
		expect(clone[0]).not.toBe(source[0]);
	});

	it('clones a Date into a new instance holding the same time', () => {
		const source = new Date('2020-01-01T00:00:00.000Z');
		const clone = cloneDeep(source);

		expect(clone).not.toBe(source);
		expect(clone.getTime()).toBe(source.getTime());

		source.setFullYear(2099);
		expect(clone.getTime()).not.toBe(source.getTime());
	});

	it('clones objects, arrays and dates nested together', () => {
		const source = { list: [{ when: new Date('2020-01-01T00:00:00.000Z') }] };
		const clone = cloneDeep(source);

		expect(clone).toEqual(source);
		expect(clone.list).not.toBe(source.list);
		expect(clone.list[0]).not.toBe(source.list[0]);
		expect(clone.list[0].when).not.toBe(source.list[0].when);
	});
});
