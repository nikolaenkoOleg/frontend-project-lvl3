install: install-deps

watch:
	npx webpack-dev-server

install-deps:
	npm ci

build:
	rm -rf dist
	NODE_ENV=production npx webpack

lint:
	npx eslint .

publish:
	npm publish
