import { cloneDeep, isFunction } from './internal';

describe('isFunction', () => {
	it.each([
		[(): number => 1, true],
		[function named(): void {}, true],
		[class C {}, true],
		[{}, false],
		[null, false],
		[undefined, false],
		['fn', false],
		[1, false],
		[[], false],
	])('reconhece %p como %p', (value, expected) => {
		expect(isFunction(value)).toBe(expected);
	});
});

describe('cloneDeep', () => {
	it('devolve primitivos sem tocar', () => {
		expect(cloneDeep(1)).toBe(1);
		expect(cloneDeep(null)).toBeNull();
		expect(cloneDeep(undefined)).toBeUndefined();
	});

	it('copia objetos aninhados sem compartilhar referencia', () => {
		const source = { a: 1, nested: { deep: { value: 'x' } } };
		const copy = cloneDeep(source);

		expect(copy).toEqual(source);
		expect(copy.nested).not.toBe(source.nested);
		copy.nested.deep.value = 'changed';
		expect(source.nested.deep.value).toBe('x');
	});

	it('copia arrays em profundidade', () => {
		const source = [{ id: 1 }, [{ id: 2 }]];
		const copy = cloneDeep(source);

		expect(copy).toEqual(source);
		expect(copy[0]).not.toBe(source[0]);
	});

	it('preserva Date, RegExp, Map e Set', () => {
		const date = new Date('2024-01-02T03:04:05.000Z');
		const source = {
			date,
			regex: /ab+c/gi,
			map: new Map([['k', { v: 1 }]]),
			set: new Set([{ v: 2 }]),
		};
		const copy = cloneDeep(source);

		expect(copy.date).toEqual(date);
		expect(copy.date).not.toBe(date);
		expect(copy.regex.source).toBe('ab+c');
		expect(copy.regex.flags).toBe('gi');
		expect(copy.map.get('k')).toEqual({ v: 1 });
		expect(copy.map.get('k')).not.toBe(source.map.get('k'));
		expect([...copy.set][0]).not.toBe([...source.set][0]);
	});

	it('compartilha funcoes por referencia', () => {
		const fn = (): number => 1;
		expect(cloneDeep({ fn }).fn).toBe(fn);
	});

	it('sobrevive a referencias circulares', () => {
		const source: Record<string, unknown> = { name: 'root' };
		source.self = source;

		const copy = cloneDeep(source);
		expect(copy.self).toBe(copy);
		expect(copy.name).toBe('root');
	});
});
