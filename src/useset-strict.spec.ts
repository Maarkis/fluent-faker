import { Builder } from './index';
interface Todo {
	id: number;
	name: string;
	done: boolean;
}

describe('useSet em nome desconhecido', () => {
	it('lanca em vez de falhar em silencio', () => {
		const act = (): Builder<Todo> =>
			new Builder<Todo>().addSet('feito', { done: true }).useSet('fieto');

		expect(act).toThrow(/Unknown set: 'fieto'/);
	});

	it('lista os sets definidos na mensagem', () => {
		const act = (): Builder<Todo> =>
			new Builder<Todo>()
				.addSet('feito', { done: true })
				.addSet('pendente', { done: false })
				.useSet('arquivado');

		expect(act).toThrow(/'feito', 'pendente'/);
	});

	it('avisa quando nenhum set foi definido', () => {
		const act = (): Builder<Todo> => new Builder<Todo>().useSet('feito');

		expect(act).toThrow(/No sets were defined/);
	});

	it('continua casando nome sem diferenciar maiusculas', () => {
		const todo = new Builder<Todo>()
			.addSet('Todo Done', { done: true })
			.useSet('todo done')
			.generate();

		expect(todo.done).toBe(true);
	});
});
