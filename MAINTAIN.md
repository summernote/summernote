## Publish new version

### 1. `develop` to `master`

Send pull request `develop` to `master` on github repository and merge it.
https://github.com/summernote/summernote/compare/master...develop

#### development 

```bash
npm install 

npm run dev
```

* you can test examples/ files 

```bash
npm run dev
open localhost:3000/examples/
click example page 
```

#### build dist files 

```bash
npm build
```

### 2. Build dist files

Build dist files and push to master
```bash
# change branch
git checkout master

# fetch all changes
git pull

# build dist files and binary(.zip) for release post
npm run build 

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
