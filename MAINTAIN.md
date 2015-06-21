## Build and publish new release

### 01. Send pull request `develop` to `master` on github repository and merge it.

https://github.com/summernote/summernote/compare/master...develop

### 02. Build dist files on master
```bash
# build dist files
grunt build
# now you can find dist files on `./dist`.
```

### 03. Post new release with tag version on github repository.

generate binary(.zip) for release post

```bash
grunt deploy
# now you can find a binary on `./dist`.
```

https://github.com/summernote/summernote/releases/new

### 04. Publish on npm
```bash
npm publish
```

### 05. Publish on meteor
```bash
meteor/publish.sh
```

### 06. Update gh-pages
