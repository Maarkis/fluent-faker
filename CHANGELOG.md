# [2.1.0](https://github.com/Maarkis/fluent-faker/compare/v2.0.0...v2.1.0) (2026-08-28)


### Features

* accept a LocaleDefinition or Faker instance as the locale ([#33](https://github.com/Maarkis/fluent-faker/issues/33)) ([050c5bb](https://github.com/Maarkis/fluent-faker/commit/050c5bbdf2dfd7e75c8b12fb8d8a3908dda0da42))
* type the locale parameter as a union of valid codes ([#32](https://github.com/Maarkis/fluent-faker/issues/32)) ([c30f951](https://github.com/Maarkis/fluent-faker/commit/c30f951451c104ea4c00d661c86297035c5079f2))

# [2.0.0](https://github.com/Maarkis/fluent-faker/compare/v1.0.5...v2.0.0) (2026-08-28)


### Bug Fixes

* preserve the active set across clone() ([#26](https://github.com/Maarkis/fluent-faker/issues/26)) ([9d17fb7](https://github.com/Maarkis/fluent-faker/commit/9d17fb76611e834508125ea1d345cb0f53379624))
* rewrite the generate(length) error message ([#30](https://github.com/Maarkis/fluent-faker/issues/30)) ([cdf1211](https://github.com/Maarkis/fluent-faker/commit/cdf12112e52abe6b2eaefc94eb1d6f78b0b4bc37))
* stop generate(length) from overflowing the call stack ([#27](https://github.com/Maarkis/fluent-faker/issues/27)) ([f935590](https://github.com/Maarkis/fluent-faker/commit/f935590ed5890fa23a5a9958530cc671f384f7e0))


* fix!: remove the generate(length?: number): Array<T> overload (#31) ([7c5c86d](https://github.com/Maarkis/fluent-faker/commit/7c5c86db55f16b2ac997345a62d0774f24aabf85)), closes [#31](https://github.com/Maarkis/fluent-faker/issues/31)
* fix!: compare addSet names exactly instead of lowercasing them (#29) ([db7dcd6](https://github.com/Maarkis/fluent-faker/commit/db7dcd6ce179dddc98bef451ca6b606b24772ee3)), closes [#29](https://github.com/Maarkis/fluent-faker/issues/29)
* fix!: throw on an invalid locale code instead of defaulting to en (#28) ([19abd64](https://github.com/Maarkis/fluent-faker/commit/19abd64b5e9b0cfe1b6dffbf94aa84881e789420)), closes [#28](https://github.com/Maarkis/fluent-faker/issues/28)
* fix!: throw when useSet is given an unknown name (#25) ([9e2ecb1](https://github.com/Maarkis/fluent-faker/commit/9e2ecb19ae9b6b7d542f2185cb96ac1262b06d7f)), closes [#25](https://github.com/Maarkis/fluent-faker/issues/25)
* fix!: let an active set override ruleFor and addModel values (#24) ([a6c16b1](https://github.com/Maarkis/fluent-faker/commit/a6c16b1d42737d6edc83e705a71be6ff0f7ad392)), closes [#24](https://github.com/Maarkis/fluent-faker/issues/24)


### BREAKING CHANGES

* generate(length?: number) is no longer a valid
overload. Passing a number | undefined value now fails to compile;
pass a definite number or call generate() with no arguments.
* addSet/useSet no longer match set names
case-insensitively. A set named 'Done' and one named 'done' are now
distinct.
* getLocale(codeLocale) - and therefore
new Builder(locale) and createBuilder(model, locale) - throws when
codeLocale is a non-empty string that does not match a Faker locale.
Previously it silently fell back to 'en'.
* useSet(name) throws instead of silently doing nothing
when name matches no set added via addSet.
* useSet(name) now overrides any value the same
property received from ruleFor or addModel/createBuilder. Previously
those always won over the active set.

## [1.0.5](https://github.com/Maarkis/fluent-faker/compare/v1.0.4...v1.0.5) (2026-08-27)


### Bug Fixes

* point root types field to the built declaration path ([#10](https://github.com/Maarkis/fluent-faker/issues/10)) ([f2f47f1](https://github.com/Maarkis/fluent-faker/commit/f2f47f12aeae47c8db56a75e702214eb9b9d012a))

## [1.0.4](https://github.com/Maarkis/fluent-faker/compare/v1.0.3...v1.0.4) (2026-08-26)


### Bug Fixes

* add .js extensions to relative imports in ESM build output ([#8](https://github.com/Maarkis/fluent-faker/issues/8)) ([62e071f](https://github.com/Maarkis/fluent-faker/commit/62e071f63f1fc324f3fcec21cfccddf5f84e80e3))

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
