# Summernote Next

Summernote Next is a maintained MIT-licensed fork of Summernote focused on the current Bootstrap 5 build, a Vanilla JS API, and a public example catalog that matches this repository.

| Resource | URL |
| --- | --- |
| Live examples | <https://juergen-schwind.com/summernote-next> |
| GitHub repository | <https://github.com/jschwind/summernote-next> |
| Maintainer | Jürgen Schwind |
| Contact | <mailto:info@juergen-schwind.de> |
| Website | <https://juergen-schwind.com> |
| License | [MIT](./LICENSE) |

## Highlights

- Bootstrap 5 focused build
- Vanilla JS public API: `summernote.create()`, `summernote.invoke()`, `summernote.getInstance()`
- Compiled assets in `dist/`
- Public example pages aligned with the current fork
- MIT license with preserved upstream copyright notice and added fork copyright

## Quick start

Install dependencies and build the distributable files:

```bash
npm install
npm run build
```

Include Bootstrap 5 and the compiled Summernote Next assets in your page:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css">
<link rel="stylesheet" href="dist/summernote-next.css">

<script defer src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
<script defer src="dist/summernote-next.js"></script>
```

Add an editor element and initialize it with the public API:

```html
<div id="editor">Hello Summernote Next</div>

<script>
  document.addEventListener('DOMContentLoaded', () => {
    summernote.create('#editor');
  });
</script>
```

## Examples

The maintained example catalog for this fork is available at <https://juergen-schwind.com/summernote-next>. The local `examples/` directory mirrors the public example structure and demonstrates the supported Bootstrap 5 and Vanilla JS setups.

## Development

Useful commands:

```bash
npm run lint
npm test
npm run build
```

## Contributing

Issues and pull requests should be opened in <https://github.com/jschwind/summernote-next>.

## Maintainer

Summernote Next is maintained by Jürgen Schwind.

- Website: <https://juergen-schwind.com>
- Email: <mailto:info@juergen-schwind.de>

## License

Summernote Next is released under the MIT License. This fork preserves the original Summernote MIT notice and adds the fork maintainer copyright for work from 2026 onward.
