## Debug with VSCode

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

```
yarn test
```

4. Open vscode
5. Set breakpoint on code
6. Press F5 to run Debug and wait to stop on breakpoint

## Publish new version

### 1. `develop` to `main`

Send pull request `develop` to `main` on github repository and merge it.
https://github.com/summernote/summernote/compare/main...develop

### 2. Build dist files

Build dist files and push to main

```bash
# change branch
git checkout main

# fetch all changes
git pull

# Bump version in package.json

# build dist files and binary(.zip) for release post
yarn build

# Commit and add tag for new version
git commit -a -m "Update dist files"
git tag -a "<new-version>"

# Push new dist files and tags to remote repository.
git push origin --tags
```

### 3. Release new version

Post release note with new tag version on github

https://github.com/summernote/summernote/releases/new

### 4. Publish

Publish on npm registry

```bash
yarn publish
```

### 5. Update summernote.github.io

Update summernote version in `_config.yml`.

### 6. Update connectors

Request maintainers of each connector to update package information.
