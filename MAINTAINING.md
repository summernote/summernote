# Maintaining Summernote

## Releasing a New Version

### 1. Merge develop to main

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
