# Fluent-Faker

## Overview

### A library for generating data in a simple way for testing
###### [Faker](https://fakerjs.dev/) is used for fake data generation

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
createBuilder<Todo>((faker) = (
    {
        id: faker.datatype.number(),
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

By default fluent-faker uses Faker.js default locale

Although you can change locale with `setLocale` function, both in `Builder` and global

### Global:

```ts
import {setLocale} from '@maarkis/fluent-faker'

setLocale('pt_BR')
```

global scope, values modify Faker.js lib

### Local:

```ts
import {Builder} from '@maarkis/fluent-faker'

new Builder<Todo>('pt_BR')
```

or

```ts
import {Builder} from '@maarkis/fluent-faker'

new Builder<People>().setLocale('pt_BR')
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

global scope, values modify Faker.js lib

### Local:

```ts
import {Builder} from '@maarkis/fluent-faker'

new Builder<Todo>().useSeed(596) // 596
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
    id: faker.datatype.number(),
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
    id: faker.datatype.number(),
    name: 'Todo 1'
})) // { id: 8874, name: 'Todo 1' }
```
or
```ts
import {generate} from "@maarkis/fluent-faker";

generate<Todo>((faker) => ({
    id: faker.datatype.number(),
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
        id: faker.datatype.number(),
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
        id: faker.datatype.number(),
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
    .ruleFor('id', (faker) => faker.datatype.number())
    .generate() // { id: 1564 }
```

---

### setLocale

**Parameters:**

| Name     | Type     | Description       | required |
|----------|----------|-------------------|:--------:|
| _locale_ | `string` | The locale to set |   yes    |

Returns: `void`

Usage:

```ts
new Builder<Todo>().setLocale('pt_BR')
```

---

### useSeed

**Parameters:**

| Name   | Type     | Description     | required |
|--------|----------|-----------------|:--------:|
| _seed_ | `number` | The seed to set |   yes    |

Returns: `number`

Usage:

```ts
new Builder<Todo>().useSeed(1) // 1
```

---

### useSet

**Parameters:**

| Name   | Type     | Description  |
|--------|----------|--------------|
| _name_ | `string` | The set name |

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
        id: faker.datatype.number(),
        name: 'Todo 1',
        done: true
    }))
    .useSet('todo done')
```
