# Maintaining Summernote

## Releasing a New Version

### 1. Update the version

Update the version in [package.json](./package.json#L4).

### 2. Update the changelog

Update the [CHANGES.md](./CHANGES.md) with the new version and the changes.

### 3. Create a PR for version and changelog and get it merged to main

### 4. Create a new release

After creating the release, summernote will be published to [npm](https://www.npmjs.com/package/summernote) by the GitHub action.

### 5. Update summernote.github.io

Update summernote [version](https://github.com/summernote/summernote.github.io/blob/master/_config.yml#L13) in `_config.yml`.
