# Maintaining Summernote Next

Summernote Next is maintained in <https://github.com/jschwind/summernote-next> and published as public examples at <https://juergen-schwind.com/summernote-next>.

## Working locally

Run project commands in Docker with the existing application container:

```bash
docker exec --user=application -w /app summernote-next-web-1 bash -lc "<command>"
```

Recommended checks:

```bash
docker exec --user=application -w /app summernote-next-web-1 bash -lc "npm run lint"
docker exec --user=application -w /app summernote-next-web-1 bash -lc "npm test"
docker exec --user=application -w /app summernote-next-web-1 bash -lc "npm run build"
```

## Documentation and metadata

Keep these files aligned whenever project ownership, branding, or public links change:

- `README.md`
- `MAINTAINING.md`
- `LICENSE`
- `package.json`
- `package-lock.json`
- `src/js/module/HelpDialog.js`
- `examples/`

All public links in examples and dialogs should point to the maintained fork, not the upstream Summernote project.

## Copyright and license

Summernote Next remains MIT licensed.

When updating copyright notices:

1. Preserve the original Summernote notice.
2. Add the fork notice for Jürgen Schwind from 2026 onward.
3. Keep the wording MIT-compatible and include the notice anywhere the license requires it.

## Release checklist

1. Update the version in `package.json` and `package-lock.json`.
2. Run lint, tests, and build in Docker.
3. Review the generated `dist/` files and example pages.
4. Commit the release changes and create the corresponding Git tag.
5. Create a GitHub release in <https://github.com/jschwind/summernote-next/releases>.

## Support channels

- Issues: <https://github.com/jschwind/summernote-next/issues>
- Website: <https://juergen-schwind.com>
- Email: <mailto:info@juergen-schwind.de>
