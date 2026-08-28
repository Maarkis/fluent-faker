# Fluent-Faker
[![CI](https://github.com/Maarkis/fluent-faker/actions/workflows/ci.yml/badge.svg)](https://github.com/Maarkis/fluent-faker/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/Maarkis/fluent-faker/branch/main/graph/badge.svg?token=5EEBKP7XZQ)](https://codecov.io/gh/Maarkis/fluent-faker)

[View source on GitHub](https://github.com/Maarkis/fluent-faker)

## Overview

### A library for generating data in a simple way for testing
###### [Faker](https://fakerjs.dev/) is used for fake data generation

## Migrating to 2.0

Four behavior changes in 2.0 are breaking:

- **`useSet` now overrides `ruleFor`/`addModel`.** Previously the base model
  always won over an active set, so a set could never actually change
  anything already set through `ruleFor` or `addModel`. Now the set wins for
  any property it defines:
  ```ts
  new Builder<Todo>()
      .ruleFor('status', 'pending')
      .addSet('done', { status: 'done' })
      .useSet('done')
      .generate() // was { status: 'pending' }, now { status: 'done' }
  ```
- **`useSet('unknown name')` throws.** Previously it silently did nothing.
  If you relied on an unmatched name being a no-op, add the set first or
  guard the call.
- **An invalid locale code throws instead of silently falling back to `en`.**
  `new Builder<Todo>('pt-BR')` (hyphen instead of underscore) used to
  silently become `en`; it now throws, naming the code you passed and
  suggesting the closest valid ones. Passing no code at all still defaults
  to `en`.
- **`addSet` names are matched case-sensitively.** `addSet('Done', ...)` and
  `addSet('done', ...)` used to collide; they're now distinct sets.
- **A type-only change:** the `generate(length?: number): Array<T>` overload
  was removed. If you were calling `generate(x)` where `x` is typed
  `number | undefined`, that no longer compiles — pass a definite `number`,
  or call `generate()` with no arguments for a single instance.

# Getting Started

## Install

Install it as a Dev Dependency using your favorite package manager

```sh
npm install @maarkis/fluent-faker --save-dev
```

or

```sh
pnpm install @maarkis/fluent-faker --save-dev
```

or

```sh
yarn add @maarkis/fluent-faker --dev
```

## Usage

```ts
interface Todo {
    id: number,
    name: string,
    description: string,
    done: boolean,
}
```

```ts
import {createBuilder} from '@maarkis/fluent-faker'

// unique instance
createBuilder<Todo>({id: 1, name: 'Todo 1'}).generate() // { id: 1, name: 'Todo 1' }

// using faker
createBuilder<Todo>((faker) => (
    {
        id: faker.number.int(),
        name: faker.lorem.word()
    }))
    .generate() // { id: 654, name: 'eaque' }
```

```ts
import {generate} from '@maarkis/fluent-faker'

// unique instance
generate<Todo>({id: 1, name: 'Todo 1'}) // { id: 1, name: 'Todo 1' }

// unique instance
generate<Todo>({id: 1, name: 'Todo 1'}, 2)
// [{ id: 1, name: 'Todo 1' },{ id: 1, name: 'Todo 1' }]
```

### Storing a function as a value

`ruleFor` and `addModel`/`addSet` treat a function argument as a *factory* —
they call it with `faker` and use the return value. To store a function
itself as the property's value, wrap it in an outer arrow function: the
outer arrow is the factory, its return value (the inner function) is what
gets assigned.

```ts
interface Job {
    onSave: () => void;
}

const myFn = () => console.log('saved');

new Builder<Job>()
    .ruleFor('onSave', () => myFn)
    .generate() // { onSave: myFn }
```

## Switching locales

By default, fluent-faker uses the default locale of Faker.js (en) when constructing new instances of the Builder.

You can change the locale by providing the locale parameter during the construction of the Builder class.

```ts
import {Builder} from '@maarkis/fluent-faker'

new Builder<Todo>('pt_BR')
```

The locale parameter is typed as a union of Faker's known locale codes, so
your editor autocompletes valid values, and an invalid one is a compile
error. At runtime, a code that somehow isn't valid (e.g. built from a
dynamic string) throws instead of silently falling back to `en`.

###### Check [Available locales](https://fakerjs.dev/guide/localization.html#available-locales) in Faker.js documentation.

### Bundle size: importing by locale code pulls in every locale

Passing a locale code string (the example above) internally imports
`allLocales` from `@faker-js/faker` — all locales, not just the one you
asked for — because that's how the code-to-locale lookup works. Measured
with esbuild (bundle + minify + gzip, minimal entry point): **~1.0 MB**.

If bundle size matters (e.g. fixtures built in the browser), construct the
`Builder` from a single-locale `Faker` instance instead, imported from that
locale's own subpath:

```ts
import {Builder} from '@maarkis/fluent-faker'
import {faker as en} from '@faker-js/faker/locale/en'

new Builder<Todo>(en)
```

Measured the same way: **~171 KB**. `Builder`'s locale parameter also
accepts a plain `LocaleDefinition` object (e.g. one entry out of
`allLocales`) if you already have one, though only the single-locale
subpath import above avoids pulling in every locale.

## Using seed

Sets the seed or generates a new one

Please note that generated values are dependent on both the seed and the number of calls that have
been made since it was set

This method is intended to allow for consistent values in a tests, so you might want to use
hardcoded values as the seed

### Global:

```ts
import {useSeed} from '@maarkis/fluent-faker'

useSeed(596) // 596
```

global scope, values modify Faker.js lib. This is the standalone `useSeed`
function and returns the seed (`number`) that was set.

### Local:

```ts
import {Builder} from '@maarkis/fluent-faker'

new Builder<Todo>().useSeed(596) // returns the Builder instance, so it chains
```

`Builder.prototype.useSeed` is a different function from the global one
above — it returns the `Builder` itself (so calls keep chaining), not the
seed. Read the effective seed back through the `seed` getter:

```ts
new Builder<Todo>().useSeed(596).seed // 596
```

## Rule precedence

Three ways to shape the generated object interact in a fixed order:

1. `addModel` / `createBuilder` — factory defaults.
2. `useSet` — the currently active set, if any.
3. `ruleFor` — explicit per-property overrides.

Each later step **overrides** an earlier one for any property both define:

```ts
new Builder<Todo>()
    .addModel({status: 'pending'})   // step 1
    .addSet('done', {status: 'done'})
    .useSet('done')                  // step 2 overrides step 1
    .generate() // { status: 'done' }
```

Because a set is applied after `addModel`/`ruleFor`, it also overrides an
explicit `ruleFor` call for the same property, regardless of call order:

```ts
new Builder<Todo>()
    .ruleFor('status', 'pending')
    .addSet('done', {status: 'done'})
    .useSet('done')
    .generate() // { status: 'done' }
```

## API Reference

### createBuilder

**Parameters:**

| Name     | Type                    | Description                   | required |
|----------|-------------------------|-------------------------------|:--------:|
| _model_  | `Partial<T> / Function` | Initial setup for the builder |    no    |
| _locale_ | `LocaleCode`             | One of Faker's locale codes   |    no    |

Returns: new `Builder` instance

Usage:

```ts
import {createBuilder} from "@maarkis/fluent-faker";

createBuilder<Todo>({ id: 1, name: 'Todo 1' })
```

or

```ts
import {createBuilder} from "@maarkis/fluent-faker";

createBuilder<Todo>((faker) => ({
    id: faker.number.int(),
    name: 'Todo 1'
}))
```
or

```ts
import {createBuilder} from "@maarkis/fluent-faker";

createBuilder<Todo>(() => ({ id: 1, name: 'Todo 1' }), 'pt_BR')
```
---

### generate

**Parameters:**

| Name     | Type                    | Description                       | required |
|----------|-------------------------|------------------------------------|:--------:|
| _model_  | `Partial<T> / Function` | Initial setup for the builder     |    no    |
| _length_ | `number`                | The number of instances to spawn  |    no    |

Returns: new ``T`` instance or collection

Usage:

```ts
import {generate} from "@maarkis/fluent-faker";

generate<Todo>({ id: 1, name: 'Todo 1'}) // { id: 1, name: 'Todo 1' }
```
or

```ts
import {generate} from "@maarkis/fluent-faker";

generate<Todo>((faker) => ({
    id: faker.number.int(),
    name: 'Todo 1'
})) // { id: 8874, name: 'Todo 1' }
```
or
```ts
import {generate} from "@maarkis/fluent-faker";

generate<Todo>((faker) => ({
    id: faker.number.int(),
    name: 'Todo 1'
}), 2) // [{ id: 8874, name: 'Todo 1' },{ id: 97856, name: 'Todo 1' }]
```

## Builder

### addModel

**Parameters:**

| Name    | Type                    | Description             | required |
|---------|-------------------------|-------------------------|:--------:|
| _model_ | `Partial<T> / Function` | Defines a set of rules. |   yes    |

Returns: `Builder` instance

Usage:

```ts
new Builder<Todo>()
    .addModel({id: 1, name: 'Todo 1'})
    .generate() // { id: 1, name: 'Todo 1' }
```

or

```ts
new Builder<Todo>()
    .addModel((faker) => ({
        id: faker.number.int(),
        name: 'Todo 1'
    }))
    .generate() // { id: 9763, name: 'Todo 1' }
```

---

### addSet

**Parameters:**

| Name      | Type                    | Description                                    | required |
|-----------|-------------------------|------------------------------------------------|:--------:|
| _name_    | `string`                | The set name, matched case-sensitively         |   yes    |
| _dataSet_ | `Partial<T> / Function` | The dataset to apply when the set is specified |   yes    |

Returns: `Builder` instance

Throws `Error` when a set with the same name was already added, naming the
key. Two names differing only by case (`'Done'` vs `'done'`) are distinct.

Usage:

```ts
new Builder<Todo>()
    .addSet('todo done', {id: 1, name: 'Todo 1', done: true})
    .useSet('todo done')
    .generate() // { id: 1, name: 'Todo 1', done: true }
```

or

```ts
new Builder<Todo>()
    .addSet('todo done', (faker) => ({
        id: faker.number.int(),
        name: 'Todo 1',
        done: true
    }))
    .useSet('todo done')
    .generate() // { id: 9763, name: 'Todo 1', done: true }
```

---

### clone

**Description:**
Clone the internal state into a new so that both are isolated from each other

Returns: new `Builder` instance

Usage:

```ts
new Builder<Todo>().clone()
```

---

### generate

**Parameters:**

| Name     | Type     | Description                      | required | note                                                           |
|----------|----------|-----------------------------------|:--------:|-----------------------------------------------------------------|
| _length_ | `number` | The number of instances to spawn |    no    | If you don't pass a length, only one entity will be generated. |

Returns: `T` instance or collection of `T`


Usage:

```ts
new Builder<Todo>()
    .addModel({id: 1, name: 'Todo 1'})
    .generate() // { id: 1, name: 'Todo 1' }
```

or

```ts
new Builder<Todo>()
    .addModel({id: 1, name: 'Todo 1'})
    .generate(2) // [{ id: 1, name: 'Todo 1' }, { id: 1, name: 'Todo 1' }]
```

---

### ruleFor

**Parameters:**

| Name            | Type                         | Description           | required |
|-----------------|------------------------------|-----------------------|:--------:|
| _property_      | `P extends keyof T / string` | Property of an entity |   yes    |
| _valueFunction_ | `T[keyof T] / Function`      | Value of a property   |   yes    |

Returns: `Builder` instance

Usage:

```ts
new Builder<Todo>()
    .ruleFor('id', 1)
    .generate() // { id: 1 }
```

or

```ts
new Builder<Todo>()
    .ruleFor('id', () => 1)
    .generate() // { id: 1 }
```

or

```ts
new Builder<Todo>()
    .ruleFor('id', (faker) => faker.number.int())
    .generate() // { id: 1564 }
```

`valueFunction` is called as a factory when it's a function — see
[Storing a function as a value](#storing-a-function-as-a-value) above if you
need the property's value to *be* a function.

---

### useSeed

**Parameters:**

| Name   | Type     | Description     | required |
|--------|----------|-----------------|:--------:|
| _seed_ | `number` | The seed to set |   yes    |

Returns: `Builder` instance (chainable). Read the effective seed through the
`seed` getter.

Usage:

```ts
new Builder<Todo>().useSeed(1).seed // 1
```

---

### useSet

**Parameters:**

| Name   | Type     | Description                              |
|--------|----------|-------------------------------------------|
| _name_ | `string` | The set name, matched case-sensitively   |

Returns: `Builder` instance

Throws `Error` when no set was registered under that name, listing the sets
that are defined.

An active set overrides `addModel`/`createBuilder` and `ruleFor` values for
any property it also defines — see [Rule precedence](#rule-precedence).

Usage:

```ts
new Builder<Todo>()
    .addSet('todo done', {id: 1, name: 'Todo 1', done: true})
    .useSet('todo done')
```

or

```ts
new Builder<Todo>()
    .addSet('todo done', (faker) => ({
        id: faker.number.int(),
        name: 'Todo 1',
        done: true
    }))
    .useSet('todo done')
```
