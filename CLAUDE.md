# ts-necessities Development Guide

## Commands

- Build: `npm run build` (builds both ESM and CJS modules)
- Clean: `npm run clean`
- Lint: `npm run lint` or `eslint src --ext .ts,.tsx`
- Test all: `npm test`
- Test single: `vitest src/path/to/file.test.ts`
- Test watch mode: `npm run test:watch`
- Test coverage: `npm run test:coverage`
- Generate docs: `npm run typedoc`

## Code Style

- **Formatting**: 4-space indentation, 120 character line width
- **Imports**: Use relative imports with file extension omitted
- **Types**: Explicit return types required; prefer specific types over `any`
- **Naming**: 
  - camelCase for variables, functions, methods
  - PascalCase for classes, interfaces, types
  - Avoid prefixing interfaces with 'I'
- **Error Handling**: Use utility functions (`assert`, `defined`, `panic`) for validation
- **Tests**: Co-locate tests with source files using `.test.ts` extension
- **Documentation**: Use JSDoc comments for exported functions and classes
- **Module System**: Supports both ESM and CommonJS via dual-format publishing

Write exhaustive tests with high coverage (aim for 95%+). Use branded types for string subtypes to enforce type safety.