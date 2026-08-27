import { Builder, createBuilder, useSeed } from './index';
interface Todo {
	id: number;
	name: string;
	done: boolean;
}

const idBuilder = () => createBuilder<Todo>((f) => ({ id: f.number.int() }));

describe('seed', () => {
	it('same global seed => same values', () => {
		useSeed(596);
		const a = idBuilder().generate();
		useSeed(596);
		const b = idBuilder().generate();
		expect(a.id).toBe(b.id);
	});

	it('global seed set AFTER the builder is constructed still applies', () => {
		const b1 = idBuilder();
		useSeed(42);
		const a = b1.generate();
		const b2 = idBuilder();
		useSeed(42);
		expect(b2.generate().id).toBe(a.id);
	});

	it('local seed overrides the global one', () => {
		useSeed(1);
		const a = idBuilder().useSeed(999).generate();
		useSeed(2);
		const b = idBuilder().useSeed(999).generate();
		expect(a.id).toBe(b.id);
	});

	it('seed 0 is a valid seed (must not be treated as falsy)', () => {
		const a = idBuilder().useSeed(0).generate();
		const b = idBuilder().useSeed(0).generate();
		expect(a.id).toBe(b.id);
	});

	it('builders are isolated: one does not consume the PRNG of another', () => {
		useSeed(7);
		const solo = idBuilder().generate();
		useSeed(7);
		idBuilder().generate(5);
		expect(idBuilder().generate().id).toBe(solo.id);
	});
});

describe('clone', () => {
	it('preserves the locale of the source builder', () => {
		const original = new Builder<Todo>('pt_BR');
		expect(original.clone().locale).toBe('pt_BR');
	});

	it('preserves seed 0 (must not be treated as falsy)', () => {
		const original = createBuilder<Todo>((f) => ({
			id: f.number.int(),
		})).useSeed(0);
		expect(original.clone().seed).toBe(0);
		expect(original.clone().generate().id).toBe(original.generate().id);
	});
});
