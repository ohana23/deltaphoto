# Releasing deltaphoto

Only package maintainers should perform these steps. Publishing requires an npm account with two-factor authentication enabled.

## First release preparation

1. Sign in to [npmjs.com](https://www.npmjs.com/) and enable two-factor authentication for authorization and publishing.
2. Make sure the repository checks pass on the `main` branch.
3. Authenticate the CLI against the public npm registry:

   ```bash
   npm login --registry=https://registry.npmjs.org/
   npm whoami --registry=https://registry.npmjs.org/
   ```

4. Confirm that the package name is still available. An `E404` response is expected before the first release:

   ```bash
   npm view deltaphoto --registry=https://registry.npmjs.org/
   ```

## Prepare a version

Every npm release needs a version that has never been published. Update the version with one of:

```bash
npm version patch
npm version minor
npm version major
```

For the initial pre-1.0 release, the version already declared in `package.json` can be used if that version has not previously been published.

Run all release checks and inspect the proposed package contents:

```bash
npm ci
npm run check
npm pack --dry-run
git status --short
```

Commit and push the version change before publishing. The working tree should be clean and CI should be green.

## Stage and approve the package

Staging separates upload from the final public release:

```bash
npm stage publish
npm stage list deltaphoto
```

Review the staged package on npmjs.com or in the CLI. Approve its stage ID with two-factor authentication:

```bash
npm stage approve <stage-id>
```

After approval, verify the public package:

```bash
npm view deltaphoto version --registry=https://registry.npmjs.org/
```

Then create and push a matching Git tag if `npm version` did not already do so.

## Subsequent releases

Use semantic versioning:

- Patch releases fix behavior without changing the public API.
- Minor releases add backward-compatible features.
- Major releases contain breaking API or behavior changes.

Never reuse a published version. npm package versions are immutable.
