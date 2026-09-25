# Repository Guide

## Packages and Commands

- This is three independent npm packages with separate lockfiles: `front/` (React/Vite), `back/` (Fastify/Drizzle), and `contract/` (TypeSpec). Install dependencies in the package being changed; there is no root npm workspace.
- Backend development loads the root `.env`: `make back-dev` runs `node --env-file=../.env --import tsx --watch app.ts`. `PORT`, `NODE_ENV`, and `DATABASE_URL` are required; Drizzle also reads `../.env`.
- Focused checks: `make front-build`, `make back-build`, and `cd front && npm run lint`.
- `make test` only runs Playwright E2E tests. Match CI locally by running `docker compose up --build -d`, `make front-install`, and `npx playwright install chromium` first. The app health endpoint is `/api/health-check`.
- Drizzle schema is `back/db/schemes/index.ts`; use `cd back && npm run db:generate`, `db:migrate`, or `db:push` with a valid root `DATABASE_URL`.

## API Contract and Backend

- TypeSpec in `contract/main.tsp` is the API source of truth. After any `contract/**/*.tsp` change, run `make types`: it compiles `contract/tsp-output/schema/openapi.json` and regenerates Fastify types in `back/types/handlers/`.
- Do not hand-edit `back/types/handlers/*.gen.ts`; `@hey-api/openapi-ts` generates it from the OpenAPI schema. Backend handlers are assembled in `back/routes/index.ts` and registered by `fastify-openapi-glue` in `back/app.ts`.
- The TypeSpec service route is `api`, so contract operations become `/api/...`; do not add a second API prefix in handlers.

## Runtime and CI

- Docker builds frontend, TypeSpec/OpenAPI, and backend independently, then serves the frontend static build and `/api/openapi.json` from the Fastify container. Use `docker compose up --build` for the integrated app.
- `front/vite.config.ts` sets `envDir: '../.'`; frontend environment variables come from the repository root and must use the `VITE_` prefix.

## Commits

- Use Conventional Commits with a Russian summary, for example: `feat: добавить проверку сессии`.
