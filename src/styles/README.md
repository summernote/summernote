Styles
======

This directory contains multiple styles of Summernote.

Each style directory becomes an entrypoint of Webpack build process.
(e.g. The files within `bs5` would be transpiled `summernote-bs5.js` and `summernote-bs5.css`.)

If you put a html file named `summernote-<style>.html`, it would be good for development and debugging processes.
By running `yarn dev`, you can test styles manually on web browsers via those files.

Also, please don't forget to add `summernote-<style>.json` which contains additional information will be used in building processes.
