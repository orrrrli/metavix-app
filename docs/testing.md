# Testing

## Unit Tests

Stack: **Vitest**

```bash
npm run test
```

Configuration lives in `vitest.config.ts`. Aliases resolve `@/` to `src/`.

## Linting

```bash
npm run lint
```

ESLint configuration is in `eslint.config.mjs`.

## Writing Tests

- Co-locate tests near the code they exercise when possible.
- Mock API calls at the `src/lib/api/` level, not inside components.
- Assert that auth-dependent components derive identity from the Zustand session store.
