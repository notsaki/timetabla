docker-dir = docker/

mongo-docker-compose = $(docker-dir)docker-compose.mongo.yml

set-mongo-docker-compose:
	$(eval docker-compose-file = $(mongo-docker-compose))

build:
	docker-compose -f $(docker-compose-file) build

up:
	docker-compose --env-file .env -f $(docker-compose-file) up --remove-orphans

mongo-build: set-mongo-docker-compose build
mongo-up: set-mongo-docker-compose up

dev:
	ENVIRONMENT=dev npm run dev

dev-run:
	ENVIRONMENT=dev npm run dev-run

app-unit-test:
	ENVIRONMENT=test nyc ./node_modules/.bin/_mocha --exit "test/unit/**/*.ts"

app-int-test:
	ENVIRONMENT=test nyc ./node_modules/.bin/_mocha --exit "test/integration/**/*.ts"

app-test: app-unit-test app-int-test

test-file:
	ENVIRONMENT=test nyc ./node_modules/.bin/_mocha --exit "test/**/$(F).ts"

test-grep:
	ENVIRONMENT=test nyc ./node_modules/.bin/_mocha --exit "test/**/*.ts" -g "$(G)"