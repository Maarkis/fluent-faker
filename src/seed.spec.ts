import { Builder, createBuilder, useSeed } from './index';
interface Todo {
	id: number;
	name: string;
	done: boolean;
}

const idBuilder = () => createBuilder<Todo>((f) => ({ id: f.number.int() }));

describe('seed', () => {
	it('mesmo seed global => mesmos valores', () => {
		useSeed(596);
		const a = idBuilder().generate();
		useSeed(596);
		const b = idBuilder().generate();
		expect(a.id).toBe(b.id);
	});

	it('seed global definido DEPOIS da construcao do builder ainda vale', () => {
		const b1 = idBuilder();
		useSeed(42);
		const a = b1.generate();
		const b2 = idBuilder();
		useSeed(42);
		expect(b2.generate().id).toBe(a.id);
	});

	it('seed local sobrescreve o global', () => {
		useSeed(1);
		const a = idBuilder().useSeed(999).generate();
		useSeed(2);
		const b = idBuilder().useSeed(999).generate();
		expect(a.id).toBe(b.id);
	});

	it('seed 0 e um seed valido (nao pode ser tratado como falsy)', () => {
		const a = idBuilder().useSeed(0).generate();
		const b = idBuilder().useSeed(0).generate();
		expect(a.id).toBe(b.id);
	});

	it('builders sao isolados: um nao consome o PRNG do outro', () => {
		useSeed(7);
		const solo = idBuilder().generate();
		useSeed(7);
		idBuilder().generate(5);
		expect(idBuilder().generate().id).toBe(solo.id);
	});
});

describe('clone', () => {
	it('preserva o locale do builder de origem', () => {
		const original = new Builder<Todo>('pt_BR');
		expect(original.clone().locale).toBe('pt_BR');
	});

	it('preserva o seed 0 (nao pode ser tratado como falsy)', () => {
		const original = createBuilder<Todo>((f) => ({
			id: f.number.int(),
		})).useSeed(0);
		expect(original.clone().seed).toBe(0);
		expect(original.clone().generate().id).toBe(original.generate().id);
	});
});
