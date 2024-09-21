# Maintaining Summernote

## Releasing a New Version

### 1. Build dist files

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

### 2. Release new version

Post release note with new tag version on github

https://github.com/summernote/summernote/releases/new

### 3. Publish

Publish on npm registry

```bash
yarn publish
```

### 4. Update summernote.github.io

Update summernote version in `_config.yml`.

### 5. Update connectors

Request maintainers of each connector to update package information.
