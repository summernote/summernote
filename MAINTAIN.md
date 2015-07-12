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

Publish on meteor
```bash
meteor/publish.sh
```

### 05. Update summernote.github.io

Update summernote and other bower components.
```bash
bower update
```

Replace binary path with new version on `getting-started.html`. This binary is generated at `3. Release new version`.

https://github.com/summernote/summernote.github.io/blob/master/html/getting-started.html
