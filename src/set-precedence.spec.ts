import { createBuilder, Builder } from './index';
interface Todo {
	id: number;
	name: string;
	done: boolean;
}

describe('precedencia de sets', () => {
	it('set sobrescreve o model base', () => {
		const todo = createBuilder<Todo>({ id: 1, done: false })
			.addSet('feito', { done: true })
			.useSet('feito')
			.generate();
		expect(todo).toEqual({ id: 1, done: true });
	});

	it('ruleFor DEPOIS do useSet ainda vence (ultima instrucao ganha)', () => {
		const todo = new Builder<Todo>()
			.addModel({ done: false })
			.addSet('feito', { done: true })
			.useSet('feito')
			.ruleFor('done', false)
			.generate();
		expect(todo.done).toBe(false);
	});

	it('sets sao combinaveis, aplicados na ordem', () => {
		const todo = new Builder<Todo>()
			.addSet('feito', { done: true })
			.addSet('renomeado', { name: 'novo' })
			.useSet('feito')
			.useSet('renomeado')
			.generate();
		expect(todo).toEqual({ done: true, name: 'novo' });
	});

	it('em conflito, o ultimo set aplicado vence', () => {
		const todo = new Builder<Todo>()
			.addSet('a', { name: 'A' })
			.addSet('b', { name: 'B' })
			.useSet('a')
			.useSet('b')
			.generate();
		expect(todo.name).toBe('B');
	});
});
