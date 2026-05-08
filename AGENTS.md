# Project Instructions

## Runtime and tooling

- Run Composer, Node, and all project tools inside Docker.
- Use the `summernote-next-web-1` container, the `application` user, and `/app` as the working directory.
- Prefer commands in this form:
    - `docker exec --user=application -w /app summernote-next-web-1 bash -lc "<command>"`

# Coding Guidelines
- only use bootstrap 5
- only use VanillaJS
- after every task, build the project

# Testing Guidelines
- 100% test coverage without ignoring any lines or files
- use playwright with chromium whether you want to test the new version and make screenshots from every step
- build jest test to every new feature or fix
- build e2e test to every new feature or fix
- build cypress test to every new feature or fix
