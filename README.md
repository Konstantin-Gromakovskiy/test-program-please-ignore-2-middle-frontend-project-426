# Интернет-магазин комплектующих для ПК

[![hexlet-check](https://github.com/Konstantin-Gromakovskiy/test-program-please-ignore-2-middle-frontend-project-426/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/Konstantin-Gromakovskiy/test-program-please-ignore-2-middle-frontend-project-426/actions)
[![Tests](https://github.com/Konstantin-Gromakovskiy/test-program-please-ignore-2-middle-frontend-project-426/actions/workflows/tests.yml/badge.svg)](https://github.com/Konstantin-Gromakovskiy/test-program-please-ignore-2-middle-frontend-project-426/actions/workflows/tests.yml)

Заготовка fullstack-интернет-магазина комплектующих для ПК. Проект развивается на TypeScript:
frontend на React/Vite, backend на Fastify, база данных PostgreSQL. API описывается в TypeSpec и
публикуется как OpenAPI.

Учебный проект Хекслета: <https://ru.hexlet.io/programs/test-program-please-ignore-2-middle-frontend>
Как это должно работать: <https://files.hexlet.app/a/qf7bsq>

## Стек

- TypeScript
- Frontend: React 19, Vite, Mantine, TanStack Router и TanStack Query, архитектура Feature-Sliced Design
- Backend: Fastify, `fastify-openapi-glue`
- PostgreSQL и Drizzle ORM
- TypeSpec и OpenAPI 3.1, генерация типов через `@hey-api/openapi-ts`
- Scalar для документации API
- Playwright для E2E-тестов
- Docker Compose

## Структура проекта

Проект состоит из четырёх независимых npm-пакетов. У каждого свой `package.json` и lock-файл,
общего npm workspace нет, зависимости ставятся в каждом пакете отдельно.

| Каталог     | Что внутри                                                                                              |
| ----------- | ------------------------------------------------------------------------------------------------------- |
| `front/`    | React-приложение на Vite. Слои FSD: `app`, `pages`, `widgets`, `features`, `entitie`, `shared`; маршруты в `routes/` |
| `back/`     | Fastify-сервер: `routes/` (обработчики), `services/`, `repositories/`, `domain/`, `db/` (схема Drizzle), `drizzle/` (миграции) |
| `contract/` | TypeSpec-контракт API (`main.tsp`, модули `auth/`, `products/`, `common/`) — источник истины для API   |
| `e2e/`      | Playwright-тесты, фикстуры пользователей и работа с базой                                              |

Дополнительно в корне: `Dockerfile` (сборка фронтенда, контракта и бэкенда), `compose.yaml`
(приложение и PostgreSQL), `Makefile` с короткими командами, `docs/agents/` и `AGENTS.md` с
правилами для AI-агентов.

### Как части связаны между собой

1. Контракт в `contract/*.tsp` компилируется в `contract/tsp-output/schema/openapi.json`.
2. Из OpenAPI генерируются типы: для бэкенда в `back/types/handlers/`, для фронтенда API-клиент
   (при `npm run build` в `front/` срабатывает `prebuild`). Сгенерированные файлы в git не
   хранятся и руками не правятся.
3. Бэкенд регистрирует обработчики через `fastify-openapi-glue` по этому же OpenAPI и раздаёт
   собранный фронтенд и документацию.
4. Миграции и тестовые данные (сиды) применяются отдельно от приложения. В Docker Compose этим
   занимается одноразовый сервис `migrate` (`back/db/setup.ts`), и `backend` стартует только
   после его успешного завершения. Сиды идемпотентны: категории и товары не дублируются.

## Запуск

Для запуска нужен Docker и Docker Compose.

```bash
git clone https://github.com/Konstantin-Gromakovskiy/test-program-please-ignore-2-middle-frontend-project-426.git
cd test-program-please-ignore-2-middle-frontend-project-426
cp .env.example .env
```

Заполните `.env`. Для локального запуска можно использовать:

```dotenv
POSTGRES_DB=computer_store
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
DATABASE_URL=postgresql://postgres:postgres@database:5432/computer_store
PORT=3000
NODE_ENV=production
```

Соберите и запустите приложение:

```bash
docker compose up --build
```

Приложение будет доступно по адресу <http://localhost:3000>.

## API-документация

- Scalar UI: <http://localhost:3000/api/docs>
- OpenAPI JSON: <http://localhost:3000/api/openapi.json>
- Исходный TypeSpec-контракт: `contract/main.tsp`

При сборке Docker-образа TypeSpec компилируется в `contract/tsp-output/schema/openapi.json`. Этот
файл раздаётся сервером по `/api/openapi.json`, а Scalar UI получает спецификацию по этому адресу.

## Локальная разработка

Установите зависимости для каждой части проекта:

```bash
npm --prefix front install
npm --prefix back install
npm --prefix contract install
npm --prefix e2e install
```

Backend читает корневой `.env` (обязательны `PORT`, `NODE_ENV` и `DATABASE_URL`). При запуске
вне Docker база должна быть доступна с хоста, поэтому в `DATABASE_URL` укажите `localhost` вместо
`database`, а саму базу поднимите через compose:

```bash
docker compose up -d database
```

```dotenv
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/computer_store
```

Backend сам миграции не применяет. Примените миграции и заполните базу тестовыми данными
(3 категории и товары к ним) командой:

```bash
make db-setup
```

Команду можно запускать повторно. Сгенерировать новую миграцию после изменения схемы
`back/db/schemes/index.ts` можно командой `npm --prefix back run db:generate`.

Затем в отдельных терминалах запустите backend и frontend:

```bash
make back-dev
make front-dev
```

Frontend (Vite, по умолчанию <http://localhost:5173>) проксирует запросы `/api` на backend по
порту из `PORT`.

### Изменение API

Источник истины — TypeSpec-контракт в `contract/`. После любых правок `contract/**/*.tsp`
выполните:

```bash
make types
```

Команда компилирует контракт в `contract/tsp-output/schema/openapi.json` и генерирует типы
обработчиков Fastify в `back/types/handlers/`. Файлы `*.gen.ts` руками не правьте. Только
компиляция OpenAPI без генерации типов — `make compile-open-api`.

### Проверки и тесты

```bash
make front-build          # сборка frontend (включая генерацию API-клиента)
make back-build           # сборка backend
npm --prefix front run lint
```

E2E-тесты находятся в `e2e/` и запускаются против приложения на порту из `PORT`. Для них нужно
собранное приложение вместе с базой (как в CI), а адрес базы с хоста задаётся переменной
`E2E_DATABASE_URL`:

```bash
docker compose up --build -d
npm --prefix e2e install
npm --prefix e2e exec playwright install chromium
make test
```

Проверить, что приложение поднялось, можно по <http://localhost:3000/api/health-check>.

### Просмотр документации во время разработки

Локальный Scalar UI можно открыть по адресу <http://localhost:8080>:

```bash
make serve-open-api
```

Команда следит за изменениями сгенерированного `openapi.json` и перезагружает UI. После изменения
TypeSpec сначала запустите `make compile-open-api`.

---

<details>
<summary>Автоматические тесты Хекслета</summary>

Тесты запускаются на каждый коммит. За запуск отвечает файл `.github/workflows/hexlet-check.yml` — не удаляйте и не переименовывайте ни его, ни репозиторий.

</details>

## О Хекслете

[Хекслет](https://ru.hexlet.io/) — школа программирования: авторские программы обучения с практикой, поддержкой наставников и реальными проектами, которые остаются в резюме. Этот репозиторий — один из таких проектов.
