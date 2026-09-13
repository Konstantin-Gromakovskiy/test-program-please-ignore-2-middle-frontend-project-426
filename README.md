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
- React и Vite
- Fastify
- PostgreSQL и Drizzle ORM
- TypeSpec и OpenAPI 3.1
- Scalar
- Docker Compose

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
```

В отдельных терминалах запустите frontend и backend:

```bash
make front-dev
make back-dev
```

Перед запуском backend создайте и заполните `.env`, как описано выше. Для генерации OpenAPI после
изменений контракта выполните:

```bash
make compile-open-api
```

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
