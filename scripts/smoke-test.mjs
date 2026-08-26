// Exercises the published ESM entry point (dist/mjs) exactly as a consumer
// using `import` under "type": "module" would, to catch packaging issues
// (e.g. missing file extensions in emitted relative imports) that unit
// tests against src/ never touch.
import assert from 'node:assert/strict';
import { createBuilder, generate, useSeed, Builder } from '../dist/mjs/index.js';
// Self-reference (via the package's own "name" + "exports") so the
// "./builder/*" subpath export in package.json is actually resolved,
// not just read.
import { Builder as SubpathBuilder } from '@maarkis/fluent-faker/builder/anything';

assert.equal(typeof createBuilder, 'function');
assert.equal(typeof generate, 'function');
assert.equal(typeof useSeed, 'function');
assert.equal(typeof Builder, 'function');
assert.equal(typeof SubpathBuilder, 'function');

useSeed(100);
const builder = createBuilder({ id: 1, name: 'Jean' });
assert.deepEqual(builder.generate(), { id: 1, name: 'Jean' });

console.log('smoke-test (mjs): OK');
