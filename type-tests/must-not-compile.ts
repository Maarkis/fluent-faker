// Casos que DEVEM falhar na compilacao. Verificados por scripts/check-type-errors.
import { createFactory } from '../src/index';

interface Todo {
	id: number;
	name: string;
	done: boolean;
}

// @expect-error: model incompleto nao satisfaz Todo
export const incompleto: Todo = createFactory<Todo>()({ id: 1 }).generate();

// @expect-error: propriedade nao preenchida nao existe no resultado
export const propAusente = createFactory<Todo>()({ id: 1 }).generate().name;

// @expect-error: colecao herda o tipo reduzido
export const colecao: Todo[] = createFactory<Todo>()({ id: 1 }).generate(2);

// @expect-error: ruleFor parcial ainda nao completa Todo
export const parcial: Todo = createFactory<Todo>()({ id: 1 }).ruleFor('name', 'x').generate();
