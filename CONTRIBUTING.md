## Welcome to the kms-tools Contribution Guide

Thank you for dedicating your time to contribute to our project! Your contributions will be reflected in the [contributors](https://github.com/ikxin/kms-tools/graphs/contributors) section.

Please take a moment to review our [code of conduct](./CODE_OF_CONDUCT.md) to ensure our community remains friendly and respectful.

In this guide, you will receive an overview of the contribution workflow, including opening an issue, creating a PR, and reviewing and merging PRs.

You can quickly navigate to specific sections of this guide using the directory icon in the top left corner of this document.

## Commit messages

This project uses [Conventional Commits](https://www.conventionalcommits.org/) so that changelogen can generate release notes and determine the next version automatically. Use one of the following prefixes for commits that should appear in the changelog:

- `feat:` for new features (minor release)
- `fix:` or `perf:` for fixes and performance improvements (patch release)
- `feat!:` or a `BREAKING CHANGE:` footer for breaking changes (major release)
- `refactor:`, `docs:`, `style:`, `test:`, `build:`, `ci:`, or `chore:` for other changes

For example:

```text
feat: add KMS server health checks
```

## Release process

Releases are managed with [changelogen](https://github.com/unjs/changelogen). This process updates the root project version; the `node-vlmcs` package is versioned separately.

1. Check out `main`, pull the latest changes, and make sure the working tree is clean.
2. Preview the unreleased changelog:

   ```bash
   pnpm release:preview
   ```

3. Create and push the release:

   ```bash
   pnpm release
   ```

The release command updates `package.json` and `CHANGELOG.md`, creates a `chore(release): vX.Y.Z` commit and matching Git tag, pushes both, and creates or updates the GitHub Release. Authenticate the GitHub CLI with `gh auth login`, or provide `GITHUB_TOKEN`, `GH_TOKEN`, or `CHANGELOGEN_TOKENS_GITHUB`; without a token, changelogen opens the manual GitHub Release page.

To override the inferred SemVer change, pass `--major`, `--minor`, `--patch`, or an exact version with `-r`:

```bash
pnpm run release --patch
pnpm run release -r 2.1.0
```

Pushing the `vX.Y.Z` tag also starts the Docker image release workflow.
