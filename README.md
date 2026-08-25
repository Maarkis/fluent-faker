# Fluent-Faker
[![CI](https://github.com/Maarkis/fluent-faker/actions/workflows/ci.yml/badge.svg)](https://github.com/Maarkis/fluent-faker/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/Maarkis/fluent-faker/branch/main/graph/badge.svg?token=5EEBKP7XZQ)](https://codecov.io/gh/Maarkis/fluent-faker)
## Overview

### A library for generating data in a simple way for testing
###### [Faker](https://fakerjs.dev/) is used for fake data generation

# Getting Started

## Install

Install it as a Dev Dependency using your favorite package manager

```sh
npm install @maarkis/fluent-faker @faker-js/faker --save-dev
```

or

```sh
pnpm install @maarkis/fluent-faker @faker-js/faker --save-dev
```

or

```sh
yarn add @maarkis/fluent-faker @faker-js/faker --dev
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

## Switching locales

By default, fluent-faker uses the default locale of Faker.js (en) when constructing new instances of the Builder.

You can change the locale by providing the locale parameter during the construction of the Builder class.

```ts
import {Builder} from '@maarkis/fluent-faker'

new Builder<Todo>('pt_BR')
```

###### Check [Available locales](https://fakerjs.dev/guide/localization.html#available-locales) in Faker.js documentation.

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

Global scope. Every Builder that has not generated yet picks it up, including
ones constructed before the call. A Builder with its own seed is unaffected.

Call `clearSeed()` to go back to unseeded behaviour.

> Note: the global seed lives in module scope, and Jest gives each test file its
> own module registry. A `useSeed()` in a shared setup file will not reach your
> test files - seed inside each file instead.

### Local:

```ts
import {Builder} from '@maarkis/fluent-faker'

new Builder<Todo>().useSeed(596) // returns the Builder, so it chains

new Builder<Todo>().useSeed(596).seed // 596
```

## Rule precedence

Rules are applied in three layers. A later layer overwrites an earlier one for
any property both define.

| Layer | Set by | Role |
| ----- | ------ | ---- |
| 1 | `addModel` / `createBuilder` | factory defaults |
| 2 | `addSet` + `useSet` | traits, in activation order |
| 3 | `ruleFor` | explicit per-instance override |

```ts
createBuilder<Todo>({ done: false })   // layer 1
    .addSet('done', { done: true })
    .useSet('done')                    // layer 2 wins over the model
    .generate() // { done: true }

createBuilder<Todo>({ done: false })
    .addSet('done', { done: true })
    .useSet('done')
    .ruleFor('done', false)            // layer 3 wins over the set
    .generate() // { done: false }
```

`ruleFor` beats a set regardless of call order. Sets stack, so
`.useSet('a').useSet('b')` applies both, with `b` winning any conflict.

### Clearing

```ts
import {clearSeed} from '@maarkis/fluent-faker'

afterEach(() => clearSeed())
```

## Limits

`generate(length)` accepts non-negative integers only, up to
`MAX_GENERATE_LENGTH` (1,000,000). Anything else throws a `RangeError`.
Generate in batches when a larger collection is intentional.

```ts
import {MAX_GENERATE_LENGTH} from '@maarkis/fluent-faker'

generate<Todo>({id: 1}, -1)    // RangeError
generate<Todo>({id: 1}, 2.5)   // RangeError
generate<Todo>({id: 1}, 1e9)   // RangeError
```

## API Reference

### createBuilder

**Parameters:**

| Name     | Type                    | Description                   | required |
|----------|-------------------------|-------------------------------|:--------:|
| _model_  | `Partial<T> / Function` | Initial setup for the builder |    no    |
| _locale_ | `string`                | The locale to set             |    no    |

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

| Name     | Type                    | Description                   | required |
|----------|-------------------------|-------------------------------|:--------:|
| _model_  | `Partial<T> / Function` | Initial setup for the builder |    no    |
| _length_ | `number`                | The locale to set             |    no    |

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
| _name_    | `string`                | The set name                                   |   yes    |
| _dataSet_ | `Partial<T> / Function` | The dataset to apply when the set is specified |   yes    |

Returns: `Builder` instance

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
Clone hte internal state into a new so that both are isolated from each other

Returns: new `Builder` instance

Usage:

```ts
new Builder<Todo>().clone()
```

---

### generate

**Parameters:**

| Name     | Type     | Description                      | required | note                                                           |
|----------|----------|----------------------------------|:--------:|----------------------------------------------------------------|
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

---

### useSeed

**Parameters:**

| Name   | Type     | Description     | required |
|--------|----------|-----------------|:--------:|
| _seed_ | `number` | The seed to set |   yes    |

Returns: `Builder` instance. Read the effective seed through the `seed` getter.

Usage:

```ts
new Builder<Todo>().useSeed(1).seed // 1
```

---

### useSet

**Parameters:**

| Name   | Type     | Description                              |
|--------|----------|------------------------------------------|
| _name_ | `string` | The set name, matched case-insensitively |

Throws `Error` when no set was registered under that name. The message lists
the sets that are defined.

```ts
new Builder<Todo>()
    .addSet('todo done', {done: true})
    .useSet('todo dnoe')
// Error: Unknown set: 'todo dnoe'. Defined sets are: 'todo done'.
```

Returns: `Builder` instance

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
