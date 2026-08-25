import { clearSeed, createBuilder, MAX_GENERATE_LENGTH, useSeed } from './index';
interface Todo {
	id: number;
	name: string;
	done: boolean;
}

const idBuilder = () => createBuilder<Todo>((f) => ({ id: f.number.int() }));

describe('clearSeed', () => {
	afterEach(() => clearSeed());

	it('devolve builders ao comportamento nao semeado', () => {
		useSeed(596);
		const semeado = idBuilder().generate();

		clearSeed();
		const livre = idBuilder().generate();
		const outroLivre = idBuilder().generate();

		expect(livre.id).not.toBe(semeado.id);
		expect(outroLivre.id).not.toBe(livre.id);
	});

	it('nao afeta um builder com seed proprio', () => {
		useSeed(1);
		const comSeedLocal = idBuilder().useSeed(42);

		clearSeed();

		expect(comSeedLocal.seed).toBe(42);
		expect(comSeedLocal.generate().id).toBe(idBuilder().useSeed(42).generate().id);
	});

	it('e idempotente', () => {
		expect(() => {
			clearSeed();
			clearSeed();
		}).not.toThrow();
	});
});

describe('teto de generate(length)', () => {
	it('aceita exatamente o limite sem estourar a validacao', () => {
		expect(() => createBuilder<Todo>({ id: 1 }).generate(MAX_GENERATE_LENGTH + 1)).toThrow(
			RangeError,
		);
	});

	it('nomeia o limite e o valor recebido', () => {
		expect(() => createBuilder<Todo>({ id: 1 }).generate(1e9)).toThrow(
			/must not exceed 1000000, received: 1000000000/,
		);
	});

	it('sugere gerar em lotes', () => {
		expect(() => createBuilder<Todo>({ id: 1 }).generate(1e9)).toThrow(/smaller batches/);
	});
});
