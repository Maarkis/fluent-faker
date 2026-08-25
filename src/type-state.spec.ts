import { Builder, createBuilder, createFactory } from './index';

interface Todo {
	id: number;
	name: string;
	done: boolean;
}

/** Compila apenas quando A e E sao exatamente o mesmo tipo. */
type Exact<A, E> = [A] extends [E] ? ([E] extends [A] ? true : false) : false;

describe('type-state via createFactory', () => {
	it('reduz o tipo as propriedades que o model preenche', () => {
		const todo = createFactory<Todo>()({ id: 1 }).generate();

		const shape: Exact<typeof todo, Pick<Todo, 'id'>> = true;
		expect(shape).toBe(true);
		expect(todo).toStrictEqual({ id: 1 });
	});

	it('infere as chaves de um model funcao', () => {
		const todo = createFactory<Todo>()((faker) => ({
			id: faker.number.int(),
			name: faker.lorem.word(),
		})).generate();

		const shape: Exact<typeof todo, Pick<Todo, 'id' | 'name'>> = true;
		expect(shape).toBe(true);
	});

	it('acumula chaves atraves de ruleFor ate completar T', () => {
		const todo = createFactory<Todo>()({ id: 1 })
			.ruleFor('name', 'Todo 1')
			.ruleFor('done', false)
			.generate();

		const shape: Exact<typeof todo, Todo> = true;
		expect(shape).toBe(true);
		expect(todo).toStrictEqual({ id: 1, name: 'Todo 1', done: false });
	});

	it('preserva o tipo reduzido em colecoes', () => {
		const todos = createFactory<Todo>()({ id: 1 }).generate(2);

		const shape: Exact<typeof todos, Array<Pick<Todo, 'id'>>> = true;
		expect(shape).toBe(true);
		expect(todos).toHaveLength(2);
	});

	it('aceita locale na segunda chamada', () => {
		const builder = createFactory<Todo>()({ id: 1 }, 'pt_BR');

		expect(builder.locale).toBe('pt_BR');
	});

	it('mantem o tipo reduzido apos clone', () => {
		const todo = createFactory<Todo>()({ id: 1 }).clone().generate();

		const shape: Exact<typeof todo, Pick<Todo, 'id'>> = true;
		expect(shape).toBe(true);
	});
});

describe('compatibilidade', () => {
	it('createBuilder continua devolvendo T completo', () => {
		const todo = createBuilder<Todo>({ id: 1 }).generate();

		const shape: Exact<typeof todo, Todo> = true;
		expect(shape).toBe(true);
	});

	it('new Builder continua permissivo', () => {
		const todo = new Builder<Todo>().addModel({ id: 1 }).generate();

		const shape: Exact<typeof todo, Todo> = true;
		expect(shape).toBe(true);
	});

	it('useSet volta ao tipo permissivo em vez de estreitar demais', () => {
		const todo = createFactory<Todo>()({ id: 1 })
			.addSet('feito', { done: true })
			.useSet('feito')
			.generate();

		const shape: Exact<typeof todo, Todo> = true;
		expect(shape).toBe(true);
		expect(todo).toStrictEqual({ id: 1, done: true });
	});
});
