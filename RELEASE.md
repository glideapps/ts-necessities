# Release Process

This document explains how to release new versions of `@glideapps/ts-necessities` to NPM.

## GitHub Actions Workflows

The repository uses two main GitHub Actions workflows:

1. **CI Workflow** (`ci.yml`)
   - Runs on every push to `main` and on pull requests
   - Runs on Node.js 20.x and 22.x
   - Performs build, lint, and test operations
   - Verifies dual module compatibility (CJS and ESM)

2. **Publish Workflow** (`publish.yml`)
   - Triggers automatically when a GitHub release is created
   - Builds, tests, and publishes the package to NPM
   - Verifies that the package version matches the GitHub release tag
   - Uses the `NPM_TOKEN` secret for authentication

## Making a Release

### Prerequisites

- Ensure you have write access to the GitHub repository
- Make sure the `NPM_TOKEN` secret is set up in the repository settings
  - Go to Settings → Secrets and variables → Actions
  - The token should have permission to publish to the `@glideapps` organization

### Steps to Release

1. **Update Package Version**
   - Update the `version` field in `package.json`
   - Commit and push the change to `main`

2. **Create a GitHub Release**
   - Go to the repository on GitHub
   - Navigate to Releases → "Create a new release"
   - Create a new tag (e.g., `v2.4.0` - must match the version in `package.json`)
   - Add a title and description for the release
   - Click "Publish release"

3. **Automatic Publishing**
   - The `publish.yml` workflow will automatically trigger
   - It will verify the version matches the tag
   - If tests pass, it will publish to NPM

4. **Verify the Release**
   - Check the Actions tab to ensure the workflow completed successfully
   - Verify the package is available on NPM with the new version

## Dual Module Format

The package is published in both CommonJS and ESM formats:

- `dist/index.js` - CommonJS module
- `dist/index.mjs` - ESM module
- `dist/index.d.ts` - TypeScript declarations

The `package.json` is configured with:
```json
{
  "main": "dist/index.js",
  "module": "dist/index.mjs",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "default": "./dist/index.js"
    }
  }
}
```

This configuration ensures that:
- Node.js projects using CommonJS will use `dist/index.js`
- Projects using ESM will use `dist/index.mjs`
- TypeScript tools will find the type definitions

## Troubleshooting

- **Workflow Failures**: Check the GitHub Actions logs for detailed error messages
- **Version Mismatch**: Ensure the tag name (without the 'v' prefix) matches the version in `package.json`
- **Publishing Issues**: Verify the `NPM_TOKEN` is valid and has publish permissions
- **Module Format Issues**: Use the dual module compatibility test to verify both formats work correctly

## NPM Package Page

The package is published at: https://www.npmjs.com/package/@glideapps/ts-necessities