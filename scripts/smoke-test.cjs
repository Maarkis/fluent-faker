// Exercises the published CJS entry point (dist/cjs) exactly as a consumer
// using `require` would, to catch packaging issues that unit tests against
// src/ never touch.
/* eslint-disable @typescript-eslint/no-var-requires */
const assert = require('node:assert/strict');
const { createBuilder, generate, useSeed, Builder } = require('../dist/cjs/index.js');
// Self-reference (via the package's own "name" + "exports") so the
// "./builder/*" subpath export in package.json is actually resolved,
// not just read.
const { Builder: SubpathBuilder } = require('@maarkis/fluent-faker/builder/anything');

assert.equal(typeof createBuilder, 'function');
assert.equal(typeof generate, 'function');
assert.equal(typeof useSeed, 'function');
assert.equal(typeof Builder, 'function');
assert.equal(typeof SubpathBuilder, 'function');

useSeed(100);
const builder = createBuilder({ id: 1, name: 'Jean' });
assert.deepEqual(builder.generate(), { id: 1, name: 'Jean' });

console.log('smoke-test (cjs): OK');
