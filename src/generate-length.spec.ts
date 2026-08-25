import { Builder } from './index';
interface Todo {
	id: number;
	name: string;
	done: boolean;
}

const b = () => new Builder<Todo>().addModel({ id: 1 });

describe('generate(length)', () => {
	it('sem argumento => instancia unica', () => {
		expect(b().generate()).toEqual({ id: 1 });
	});

	it('0 => array vazio', () => {
		expect(b().generate(0)).toEqual([]);
	});

	it('rejeita negativo com mensagem clara', () => {
		expect(() => b().generate(-1)).toThrow(RangeError);
		expect(() => b().generate(-1)).toThrow(/greater than or equal to 0/);
	});

	it('rejeita nao-inteiro', () => {
		expect(() => b().generate(2.5)).toThrow(/must be an integer/);
	});

	it('rejeita NaN e Infinity', () => {
		expect(() => b().generate(NaN)).toThrow(RangeError);
		expect(() => b().generate(Infinity)).toThrow(RangeError);
	});

	it('aguenta coleção grande sem estourar a stack', () => {
		expect(b().generate(200_000)).toHaveLength(200_000);
	});
});
