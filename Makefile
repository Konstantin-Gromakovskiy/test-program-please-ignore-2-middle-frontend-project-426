front-build:
	cd front && npm run build
back-build:
	cd back && npm run build
front-dev:
	cd front && npm run dev
back-dev:
	cd back && npm run dev
front-install:
	cd front && npm install
back-install:
	cd back && npm install
contract-install:
	cd contract && npm install
e2e-install:
	cd e2e && npm install

# установка зависимостей всех пакетов (её вызывает автопроверка Хекслета)
setup: front-install back-install contract-install e2e-install
db-setup:
	cd back && npm run db:setup
start:
	cd back && npm run start
test:
	cd e2e && npm test

 # генерация openapi
compile-open-api:
	cd contract && npm run compile
# запуск локального ui scalar
serve-open-api:
	cd contract && npm run serve

# генерация интерфейса api для fastify
types-to-handlers:
	 cd back && npm run openapi-ts

types: compile-open-api types-to-handlers
