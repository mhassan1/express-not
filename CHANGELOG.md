# Changelog

## [3.0.0] - 2023-09-11
[3.0.0]: https://github.com/mhassan1/express-not/compare/v2.1.0...v3.0.0

### BREAKING CHANGES

- Moved to Express 5

## [2.1.0] - 2021-04-12
[2.1.0]: https://github.com/mhassan1/express-not/compare/v2.0.2...v2.1.0

- Move to TypeScript
- Move to Yarn Berry

## [2.0.2] - 2020-04-10
[2.0.2]: https://github.com/mhassan1/express-not/compare/v2.0.1...v2.0.2

- Add `@ava/babel` for `ava@3`

## [2.0.1] - 2020-04-10
[2.0.1]: https://github.com/mhassan1/express-not/compare/v2.0.0...v2.0.1

- Bump `ava` for `minimist` vulnerability ([CVE-2020-7598](https://github.com/advisories/GHSA-vh95-rmgr-6w4m))
- Move `array-flatten` from `peerDependencies` to `dependencies`

## [2.0.0] - 2019-12-12
[2.0.0]: https://github.com/mhassan1/express-not/compare/v1.1.0...v2.0.0

- Added support for middleware spread
- Moved options before middleware spread
- Renamed `end` to `matchToEnd`

### BREAKING CHANGES

- Changes to parameters
  - `options.end` has been renamed to `options.matchToEnd`
  - any number of `middleware` can now be passed after the `options` object

## [1.1.0] - 2019-12-11
[1.1.0]: https://github.com/mhassan1/express-not/compare/v1.0.0...v1.1.0

- Added support for `.all`-style route matching
- Added support for middleware arrays
- Added Travis

## [1.0.0] - 2019-12-11
[1.0.0]: https://github.com/mhassan1/express-not/compare/25317577...v1.0.0

- Initial commit
