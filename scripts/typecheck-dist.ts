// Type-checked against the published declaration files (dist/types), not
// src/, to catch cases where the emitted .d.ts don't resolve or don't match
// what "exports"/"types" in package.json promise to consumers.
import { createBuilder, generate, useSeed, Builder } from '../dist/types/index';
import { Builder as SubpathBuilder } from '../dist/types/builder';

interface Person {
	id: number;
	name: string;
}

const builder: Builder<Person> = createBuilder<Person>({ id: 1, name: 'Jean' });
const person: Person = builder.generate();
const people: Person[] = generate<Person>({ id: 1, name: 'Jean' }, 2);
const seed: number = useSeed(100);
const subpathBuilder: SubpathBuilder<Person> = new SubpathBuilder<Person>();

void person;
void people;
void seed;
void subpathBuilder;
