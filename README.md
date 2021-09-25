# Eye Health

A Firefox WebExtension that notifies you to take breaks at specified intervals of time.

Icons made by [Freepik](https://www.freepik.com) from [www.flaticon.com](https://www.flaticon.com/).

## Getting Started

Audio files for the extension are located in `resources/sounds/`.

The frontend (i.e. popup) is located in `src/popup/`, the backend (i.e. repeated interval logic) is located in `src/background_page/`.

### Testing

Run tests via `yarn test:es6`.

Jest is used for unit testing. Due to Jest's [experimental ES6 module support](https://jestjs.io/docs/ecmascript-modules), the following options are set (and should be updated/removed when support is stable):

1. The Jest configuration file, `jest.config.js` is written as an ES6 module instead of a CommonJS module:

   - i.e. `module.exports = { ... }` to `export default = { ... }`

2. The `transforms` property is disabled to prevent transforming the `import`/`export` keywords in ES6:

   - i.e. `export default = { ..., transforms: {}, ... }`

3. Experimental options are passed to `node` when running the `jest` binary:

   - i.e. [`"test:es6": "NODE_OPTIONS=--experimental-vm-modules yarn test"`](https://nodejs.org/api/cli.html#cli_node_options_options)

4. `type` is set to ES6 module in `package.json`

5. `@jest/globals` is added as a `devDependency` to access the `jest` object in tests

Since [`jsdom` does not support `HTMLMediaElement` APIs](https://github.com/jsdom/jsdom/issues/2155), they have been polyfilled in `jest.config.js` (see `setupFilesAfterEnv`).

## Build From Source

1. Clone the repo and run `yarn` to install dependencies.
2. Run `yarn run build`. The build artifact will appear in `web-ext-artifacts` as a `.zip` file.
