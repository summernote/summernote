# Contributing

## Contribution Flow

This is a rough outline of what a contributor's workflow looks like:

1. Fork the repository on GitHub.
1. Clone the forked repository to your local machine.
1. Create a topic branch from where you want to base your work.
1. Make commits of logical units.
1. Make sure your commit messages are in the proper format.
1. Push your changes to a topic branch in your fork of the repository.
1. Submit a pull request to the original repository.
1. The PR must receive a :+1: from maintainers.

> Don't include dist/* files** on your commits
>
> Please be sure that you are not submitting changes made to the files in the `dist/` folder, and only to the files contained in the `src/` folder.

## Building and Testing Summernote

### Building Summernote

For building Summernote, you will need to have Node.js and Yarn installed on your machine.

- Node.js: https://nodejs.org/
- Yarn: https://yarnpkg.com/

```bash
# Install dependencies
$ yarn install

# Build summernote
$ yarn build
```

After running `yarn build`, you should now have a `dist/` directory populated with everything you need to use Summernote.

### Starting the local server

For developing Summernote, you can start a local server. This will allow you to make changes to the source code and see the changes in real-time.

```bash

## Start local server for developing Summernote.

```bash
$ yarn dev
# Open a browser on http://localhost:3000.
# If you change source code, automatically reload your page.
```

### Testing Summernote

To run the tests, you can use the following command:

```bash
$ yarn test
```

You can also run the tests in a specific browser. To do this, you can pass the `--browser` argument to the `yarn test` command.

```bash
$ yarn test --browser=chrome
````

The following browsers are supported: https://vitest.dev/guide/browser.html#browser-option-types

### Test Watch Mode

If you would like to run some part of your test codes, use the watch mode.

```bash
$ yarn test:watch
```

`vitest` will run test and keep waiting other test requests.

### Running Specific Tests

If you want to run some part of your test codes, below shows how to run `dom.spec.js` related tests only.

```bash
$ yarn test test/base/core/dom.spec.js
```

### Debugging Tests

You can debug unit tests with VSCode following the steps:
(Based on [article](https://vitest.dev/guide/debugging#vs-code))

1. Install [VsCode](https://code.visualstudio.com/docs/setup/setup-overview)
2. Create launch.json file on ~/.vscode folder with follow config:

```json
{
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Current Test File",
      "autoAttachChildProcesses": true,
      "skipFiles": ["<node_internals>/**", "**/node_modules/**"],
      "program": "${workspaceRoot}/node_modules/vitest/vitest.mjs",
      "args": ["run", "${relativeFile}"],
      "smartStep": true,
      "console": "integratedTerminal"
    }
  ]
}
```

3. On terminal, run test with command:

```bash
$ yarn test
```

4. Open vscode
5. Set breakpoint on code
6. Press F5 to run Debug and wait to stop on breakpoint

## Conventions

In order to maintain a consistent codebase, we have a few coding conventions in place.

### Code Style

- eslint: https://eslint.org
- eslint rule: https://github.com/summernote/summernote/blob/master/.eslintrc

> As part of this repo, we use [Husky](https://github.com/typicode/husky) for git hooks. We leverage the prepush hook to prevent bad commits.

### Format of the Commit Message

We follow a rough convention for commit messages that is designed to answer two questions: what changed and why. The subject line should feature the what and the body of the commit should describe the why.

```
Remove the synced seq when detaching the document

To collect garbage like CRDT tombstones left on the document, all
the changes should be applied to other replicas before GC. For this
, if the document is no longer used by this client, it should be
detached.
```

The subject line should be 70 characters or less and the body should be wrapped at 80 characters. This allows the message to be easier to read on GitHub as well as in various git tools.

### Testing

Testing is the responsibility of all contributors, but it is also coordinated by maintainers. It is recommended to write them in order from successful cases to exceptional cases.

## Document Structure

Understand the document structure of Summernote is important to contribute to the project. In Summernote, user can edit the document with various elements and nodes in HTML. But, the document structure is limited to the following:

```text
- body container: <div class="note-editable">, <td>, <blockquote>, <ul>
- block node: <div>, <p>, <li>, <h1>, <table>
- void block node: <hr>
- inline node: <span>, <b>, <font>, <a>, ...
- void inline node: <img>
- text node: #text
```

- A body container has block node, but `<ul>` has only `<li>` nodes.
- A body container also has inline nodes sometimes. This inline nodes will be wrapped with `<p>` when enter key pressed.
- A block node only has inline nodes.
- A inline nodes has another inline nodes
- `#text` and void inline node doesn't have children.
