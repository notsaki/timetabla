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
	npm run dev

dev-run:
	npm run dev-run

app-test:
	npm test

test-file:
	ENVIRONMENT=test nyc ./node_modules/.bin/_mocha 'test/**/$(F).ts'