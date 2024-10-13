# Maintaining Summernote

## Releasing a New Version

### 1. Update the version

Update the version in [package.json](./package.json#L4).

### 2. Update the changelog

Update the [CHANGES.md](./CHANGES.md) with the new version and the changes.

### 3. Create a PR for version and changelog and get it merged to main

### 4. Create a new release

Create a new release in [GitHub](https://github.com/summernote/summernote/releases/new) with the new version.

1. Click on the `Releases` button in GitHub.
2. Click on the `Draft a new release` button.
3. Enter the tag version (e.g. `v0.9.0`).
4. Click on the `Generate release notes` button to get the changelog.
5. Attach the `/dist/summernote-<version>-dist.zip` file to the release.
6. Click on the `Publish release` button.

After creating the release, summernote will be published to [npm](https://www.npmjs.com/package/summernote) by the GitHub action. Also, the release will be published to [cdnjs](https://cdnjs.com/libraries/summernote).

### 5. Update summernote.github.io

Update summernote [version](https://github.com/summernote/summernote.github.io/blob/main/_config.yml#L13), [summernote_css](https://github.com/summernote/summernote.github.io/blob/main/_config.yml#L18) and [summernote_js](https://github.com/summernote/summernote.github.io/blob/main/_config.yml#L19) in `_config.yml`.
