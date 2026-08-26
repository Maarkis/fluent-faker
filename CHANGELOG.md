# [1.0.0](https://github.com/Maarkis/fluent-faker/compare/v0.3.0...v1.0.0) (2026-08-26)


### Bug Fixes

* make global seed actually reach every Builder instance ([#7](https://github.com/Maarkis/fluent-faker/issues/7)) ([d7758c7](https://github.com/Maarkis/fluent-faker/commit/d7758c7310dc888c8301b01569d9151aca7e327e))


### BREAKING CHANGES

* `Builder.useSeed()` now returns `Builder<T>` instead of
`number`. Use the new `Builder.seed` getter to read the effective seed.

* test: translate seed.spec.ts descriptions to English

* fix: make pre-commit hook executable and fix formatting issues it now enforces

The pre-commit hook was tracked as non-executable (100644), so husky
silently skipped tests/lint on every commit. Fixed the mode and
resolved the prettier/eslint issues it surfaced in builder.ts and
seed.spec.ts.

# [0.3.0](https://github.com/Maarkis/fluent-faker/compare/v0.2.1...v0.3.0) (2026-08-26)


### Features

* create GitHub Releases on publish ([#6](https://github.com/Maarkis/fluent-faker/issues/6)) ([431577c](https://github.com/Maarkis/fluent-faker/commit/431577c7af122c5680a16aeff1a5eb780a8aa578))

## [0.2.1](https://github.com/Maarkis/fluent-faker/compare/v0.2.0...v0.2.1) (2026-08-26)


### Bug Fixes

* force @semantic-release/npm 13.1.5 even in semantic-release's own nested dependency ([#5](https://github.com/Maarkis/fluent-faker/issues/5)) ([e5ec34e](https://github.com/Maarkis/fluent-faker/commit/e5ec34ef560457bd743e97ec404bdc7da5851acc))

# [0.2.0](https://github.com/Maarkis/fluent-faker/compare/v0.1.0...v0.2.0) (2024-01-02)


### Features

* contract ([3733aab](https://github.com/Maarkis/fluent-faker/commit/3733aabac641daf2b534a9482289d76fbb707003))

# [0.1.0](https://github.com/Maarkis/fluent-faker/compare/v0.0.12...v0.1.0) (2024-01-02)


### Features

* add semantic-release dev dependencies ([3e0cb91](https://github.com/Maarkis/fluent-faker/commit/3e0cb91eb702876dc8085a23e60414d69b628a98))
* fixing deprecated methods of fakerjs lib ([302e5f2](https://github.com/Maarkis/fluent-faker/commit/302e5f24fefd1d68b52973d822e6f387aa2ea555))
