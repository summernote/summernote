## Debug with VSCode


You can debug unit tests with VSCode following the steps:
(Based on [article](http://blog.mlewandowski.com/Debugging-Karma-tests-with-VSCode.html))

1. Install [VsCode](https://code.visualstudio.com/docs/setup/setup-overview)
2. Install [debugger-for-chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome) extension.
3. Create launch.json file on ~/.vscode folder with follow config:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "attach",
      "name": "Attach Karma Chrome",
      "address": "localhost",
      "port": 9333,
      "sourceMaps": true,
      "pathMapping": {
        "/": "${workspaceRoot}",
        "/base/": "${workspaceRoot}/"
      }
    }
  ]
}
```
4. On terminal, run test with command:
```
npm run test:debug
```
4. Open vscode
5. Set breakpoint on code
6. Press F5 to run Debug and wait to stop on breakpoint

## Publish new version

### 1. `develop` to `master`

Send pull request `develop` to `master` on github repository and merge it.
https://github.com/summernote/summernote/compare/master...develop

### 2. Build dist files

Build dist files and push to master
```bash
# change branch
git checkout master
# fetch all changes
git pull
# build dist files and binary(.zip) for release post
grunt dist
# Push new dist files to remote repository.
git commit -a -m "Update dist files"
git push origin
```

### 3. Release new version
Post release note with new tag version on github

https://github.com/summernote/summernote/releases/new

### 4. Publish

Publish on npm
```bash
npm publish
```

### 05. Update summernote.github.io
Update summernote version in _config.yml.

### 06. Update connector
 - [summernote-rails](https://github.com/summernote/summernote-rails/blob/master/MAINTAIN.md)
