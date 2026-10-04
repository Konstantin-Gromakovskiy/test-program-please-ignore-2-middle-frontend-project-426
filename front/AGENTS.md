[Mantine documentation](https://mantine.dev/llms.txt)

# Frontend Architecture

Frontend code uses Feature-Sliced Design (FSD). When adding or changing functionality, place components, hooks, API logic, and related code in the appropriate FSD layer instead of keeping feature-specific code in a flat `src/` directory.

## Layers

- `app/` - application setup, providers, global styles, routing, and initialization.
- `pages/` - complete screens assembled from widgets and features.
- `widgets/` - substantial page sections that combine entities and features.
- `features/` - user actions and business scenarios, such as authentication or editing a profile.
- `entities/` - domain objects and their related UI, types, and API logic.
- `shared/` - reusable UI, utilities, configuration, and infrastructure without domain-specific business logic.

## Dependency Rules

- A layer may depend only on layers below it: `app` -> `pages` -> `widgets` -> `features` -> `entities` -> `shared`.
- Do not import code from a higher layer into a lower layer or create circular dependencies between slices.
- Import another slice through its public API, normally its `index.ts`, rather than reaching into its internal files.
- Keep components, hooks, API calls, types, and tests close to the slice or segment they belong to.
- Put code in `shared` only when it is genuinely reusable and has no domain-specific business logic.
- Keep helper functions and code not directly responsible for rendering or component behavior in the slice's `lib/` segment.

## Component Conventions

- Do not declare types, interfaces, or mapping helpers inside component files: they add visual noise. Put types in the slice's `model/types.ts` and helpers in `lib/`; a component file contains only markup and behavior and imports its props type.
- Presentational ("dumb") components, such as a product card, declare their own props interface with display-ready values (for example a formatted `price` string) and never accept API DTOs from `@/shared/api`. A change to the DTO must not affect the component.

## Existing Structure

The current flat files and directories in `src/` may be migrated to FSD incrementally. Do not perform a broad restructuring unless the task requires it; when adding or substantially changing code, place it in the appropriate FSD layer and preserve existing behavior.

## Checks

Run commands from the `front/` directory:

- `npm run lint` - run ESLint for the frontend source and configuration files.
- `npm run lint:fsd` - run Steiger to validate Feature-Sliced Design structure and imports.
- `npm run build` - run the TypeScript project build and create the production Vite bundle.

For frontend changes, run at least `npm run lint`, `npm run lint:fsd`, and `npm run build`.
